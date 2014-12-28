define(function(require) {
  var Pixy = require('ext/pixy');
  var Psync = require('psync');
  var K = require('constants');
  var RSVP = require('rsvp');
  var moment = require('moment');
  var Session = require('core/session');
  var User = require('core/current_user');
  var TransactionFilters = require('./transaction_filters');
  var ajax = require('core/ajax');
  var Messenger = require('core/messenger');
  var CategoryStore = require('./categories');
  var PaymentMethodStore = require('./payment_methods');
  var $ = require('jquery');
  var _ = require('lodash');
  var analytics = require('actions/analytics');
  var convertCase = require('util/convert_case');

  var without = _.without;
  var pick = _.pick;
  var OUTBOUND_ATTRS = K.TRANSACTION_OUTBOUND_ATTRS;

  var store, collection, activeId;
  var editing = false;

  var getCollection = function(accountId) {
    var account;

    if (accountId) {
      account = User.accounts.get(accountId);
    }
    else {
      account = User.getActiveAccount();
    }

    return account.transactions;
  };

  var get = function(id, accountId) {
    return getCollection(accountId).get(id);
  };

  var create = function(type, onChange) {
    var transaction = collection.findNew() || collection.push({ id: K.NEW_MODEL_ID });
    transaction.set({ type: type });
    activeId = transaction.id;
    editing = true;
    onChange();
  };

  // Reset the editing state when the transaction is destroyed.
  var onDestroy = function(id) {
    if (id === activeId) {
      activeId = undefined;
      editing = false;
    }
  };

  var destroy = function(onChange, onError) {
    var transaction = get(activeId);
    var wasNew;

    if (!transaction) {
      return onError(K.ERROR_ACTIVE_TRANSACTION_REQUIRED);
    }

    wasNew = transaction.isNew();

    transaction.destroy().then(function() {
      onDestroy(activeId);

      if (!wasNew) {
        analytics.removeTransaction();
      }

      onChange();
    }, function(error) {
      analytics.removeTransactionFailed(error);
      onError(error);
    });
  };

  store = new Pixy.Store('transactions', {
    getInitialState: function() {
      return {
        loading: false
      };
    },

    prepare: function() {
      if (!collection) {
        this.setCollection(User.getActiveAccount().transactions);
      }
    },

    /**
     * Retrieve a collection of transactions from the API.
     *
     * @param  {String} from
     * @param  {String} to
     * @param  {String} format
     *
     * @return {Object[]}
     *         Serialized set of the transactions.
     */
    fetch: function(from, to, format) {
      from = from || moment().subtract(1, 'months');
      to = to || moment().add(1, 'months');

      if (collection.account.isNew()) {
        return RSVP.reject('Account must be saved.');
      }

      collection.setRange(from, to, format);

      activeId = undefined;

      return collection.fetch({ reset: true }).then(function() {
        this.emitChange();

        return this.getAll();
      }.bind(this));
    },

    drilldownMode: function() {
      return collection.drilldownMode;
    },

    getAll: function() {
      return collection.toProps();
    },

    canLoadMore: function() {
      return collection && collection.meta.hasMore;
    },

    loadMore: function() {
      console.assert(!!collection,
        'You must activate a transaction collection before attempting to load more of it!');

      if (!collection) {
        throw new Error('No collection assigned to TransactionStore.');
      }

      return collection.fetchNext().then(this.emitChange.bind(this));
    },

    loadAll: function() {
      return collection.fetchAll().then(this.emitChange.bind(this));
    },

    getActiveId: function() {
      return activeId;
    },

    /**
     * @return {Boolean} Whether we're currently editing a transaction.
     */
    isEditing: function() {
      return editing;
    },

    isLoading: function() {
      return this.state.loading;
    },

    breakCategoryAssociations: function(categoryId) {
      if (!this.collection) {
        return;
      }

      this.collection.forEach(function(model) {
        model.set({
          category_ids: without(model.get('category_ids'), categoryId)
        }, { silent: true, validate: false });
      });
    },

    breakPaymentMethodAssociations: function(id) {
      if (!this.collection) {
        return;
      }

      this.collection.forEach(function(model) {
        if (model.get('payment_method_id') === id) {
          model.set({ payment_method_id: undefined }, { silent: true, validate: false });
        }
      });
    },

    actions: {
      activate: function(payload, onChange, onError) {
        var transaction = get(payload.id);

        if (transaction) {
          if (activeId !== transaction.get('id')) {
            activeId = transaction.get('id');
            onChange();
          }
        } else {
          onError("Transaction could not be found.");
        }
      },

      reload: function(params, onChange, onError) {
        var model = this.collection.get(params.id);

        if (!model) {
          return onError();
        }

        model.fetch({ parse: true }).then(onChange, onError);
      },

      removeAttachment: function(params, onChange, onError) {
        var model = this.collection.get(params.id);
        var attachment;

        if (!model) {
          return onError();
        }

        attachment = model.attachments.get(params.attachmentId);

        if (!attachment) {
          return onError();
        }

        attachment.destroy({ wait: true }).then(function() {
          model.fetch({ parse: true }).then(onChange, onError);
        }, onError);
      },

      add: function(type, onChange, onError) {
        create(type, onChange, onError);
      },

      changeType: function(newType, onChange, onError) {
        var transaction = get(activeId);
        var KNOWN_TYPES = [ K.TX_EXPENSE, K.TX_INCOME, K.TX_TRANSFER ];

        if (transaction && transaction.isNew()) {
          if (KNOWN_TYPES.indexOf(newType) !== -1) {
            transaction.set('type', newType);
            onChange();
          }
          else {
            onError('Unknown transaction type "' + newType + '"');
          }
        }
        else {
          onError('changeType can only be done on new, unsaved transactions.');
        }
      },

      save: function(params, onChange, onError) {
        var transaction, attrs, options;
        var collection = getCollection(params.accountId);

        if (params.id) {
          transaction = collection.get(params.id);

          if (!transaction) {
            return onError(K.ERROR_ACTIVE_TRANSACTION_REQUIRED);
          }
        }
        else {
          transaction = collection.findOrAddNew();

          if (params.type) {
            transaction.set('type', params.type);
          }
        }

        if (params.type === K.TX_TRANSFER) {
          return this.actions.transfer.call(this, params, onChange, onError);
        }

        attrs = pick(convertCase.underscore(params), OUTBOUND_ATTRS);
        options = {
          wait: true,
          validate: true,
          patch: !transaction.isNew()
        };

        transaction.save(attrs, options).then(function() {
          if (options.patch) {
            analytics.updateTransaction(transaction.get('type'), transaction.get('amount'));
          } else {
            analytics.createTransaction(transaction.get('type'), transaction.get('amount'));
          }

          activeId = transaction.get('id');
          collection.sort();
          onChange();
        }, function(error) {
          if (options.patch) {
            analytics.updateTransactionFailed(error);
          }
          else {
            analytics.createTransactionFailed(error);
          }

          onError(error);
        });
      },

      transfer: function(params, onChange, onError) {
        var attrs = pick(convertCase.underscore(params), OUTBOUND_ATTRS);
        var accounts = User.accounts;

        ajax({
          url: '/accounts/transfers',
          data: JSON.stringify(attrs),
          type: 'POST'
        }).then(function(payload) {
          payload.forEach(function(transactionData) {
            var account = accounts.get(transactionData.account_id);
            var transaction;

            if (account) {
              transaction = account.transactions.push(transactionData, {
                parse: true,
                validate: false,
                sort: true
              });

              if (this.collection.account === account) {
                activeId = transaction.get('id');
              }
            }
          });

          analytics.createTransfer();

          onChange();
        }, function(error) {
          analytics.createTransferFailed(error);
          onError(error);
        });
      },

      destroy: function(params, onChange, onError) {
        destroy(onChange, onError);
      },

      /**
       * Discard any local changes made to the transaction, e.g while editing.
       */
      restore: function(__payload, onChange, onError) {
        var transaction = get(activeId);

        if (transaction) {
          if (transaction.isNew()) {
            return destroy(onChange, onError);
          }
          else {
            transaction.restore().then(function() {
              collection.sort();

              onChange();
            }, onError);
          }
        } else {
          onError(K.ERROR_ACTIVE_TRANSACTION_REQUIRED);
        }
      },

      csv: function(params, onChange, onError) {
        var url = User.get('links').export_transactions;
        var accounts = User.accounts;
        var progresses = User.progresses;

        ajax({
          url: url,
          type: 'POST',
          cache: false,
          data: JSON.stringify({
            account_ids: accounts.pluck('id'),
            from: collection.from.toJSON(),
            to: collection.to.toJSON(),
            format: 'csv'
          })
        }).then(function(progress) {
          analytics.generateTransactionCSV();
          progresses.add(progress);
          onChange(progress.id);
        }, function(error) {
          analytics.generateTransactionCSVFailed(error);
          onError(error);
        });
      },

      edit: function(__payload, onChange) {
        if (!editing && activeId) {
          editing = true;
          onChange();
        }
      },

      stopEditing: function(params, onChange) {
        if (editing) {
          this.stopEditing();
          onChange();
        }
      },
    },

    /**
     * @internal
     */
    setCollection: function(inCollection) {
      collection = this.collection = inCollection;
      this.emitChange();
    },

    /**
     * @internal
     */
    reset: function() {
      collection = this.collection = undefined;

      activeId = undefined;
      this.stopEditing();
    },

    stopEditing: function() {
      editing = false;

      if (activeId === K.NEW_MODEL_ID) {
        this.collection.remove(this.collection.get(activeId));
        activeId = undefined;
      }
    },
  });

  User.on('change:activeAccount', function(account) {
    store.setCollection(account.transactions);
  });

  Session.on('change:active', function() {
    store.reset();
  });

  TransactionFilters.addChangeListener(function() {
    store.emitChange();
  });

  Psync.Player.on('transactions:create', function(modelId) {
    collection.sort();
    store.emitChange();
  });

  Psync.Player.on('transactions:update', function(modelId) {
    collection.sort();
    store.emitChange();
  });

  Psync.Player.on('transactions:delete', function(modelId) {
    onDestroy(modelId);
    store.emitChange();
  });

  CategoryStore.on('remove', function(id) {
    store.breakCategoryAssociations(id);
  });

  PaymentMethodStore.on('remove', function(id) {
    store.breakPaymentMethodAssociations(id);
  });

  return store;
});