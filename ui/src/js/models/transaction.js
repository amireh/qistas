define(function(require) {
  var _ = require('ext/underscore');
  var Parent = require('./generic_transaction');
  var BalanceCalculator = require('./balance_calculator');
  var Psync = require('psync');
  var K = require('constants');
  var convertCase = require('util/convert_case');
  var clone = _.clone;

  /**
   * @class  Pibi.Models.Transaction
   * @extends Pixy.DeepModel
   *
   * A income or expense transaction.
   *
   * @alternateClassName Transaction
   */
  return Parent.extend({
    name: 'Transaction',
    mixins: [ Psync.Adapters.Pixy.ModelMixin ],

    psync: {
      collectionKey: 'transactions',
      scopeKey: 'account'
    },

    defaults: {
      note: '',
      currency: '',
      occurred_on: (new Date()).toISOString(),
      payment_method_id: '',
      category_ids: undefined,
      splits: undefined,
      source_account_id: undefined,
      target_account_id: undefined,
    },

    urlRoot: function() {
      return this.collection.account.get('links.transactions');
    },

    /**
     * The coefficient of the transaction's amount, -1 for expenses and 1
     * for incomes.
     */
    getCoefficient: function() {
      return this.get('type') === K.TX_EXPENSE ? -1 : 1;
    },

    /**
     * Save the transaction and adjust the account balance afterwards.
     *
     * @return {RSVP.Promise}
     */
    save: function() {
      var account = this.getAccount();
      var wasNew = this.isNew();
      var originalServerAttrs = clone(this.serverAttrs);

      return Parent.prototype.save.apply(this, arguments).then(function(rc) {
        if (wasNew) {
          BalanceCalculator.addToAccountBalance(account, this.getSignedAmount());
        } else {
          BalanceCalculator.adjustAccountBalance(account,
            this.serverAttrs,
            originalServerAttrs,
            this.getCoefficient());
        }

        return rc;
      }.bind(this));
    },

    _assignDefaults: function() {
      var attrs = Parent.prototype._assignDefaults.apply(this, arguments);

      if (!attrs.category_ids) {
        attrs.category_ids = [];
      }

      if (!attrs.splits) {
        attrs.splits = [];
      }

      return attrs;
    },

    /**
     * Destroy the transaction and then deduct its amount from the account
     * balance.
     *
     * @return {RSVP.Promise}
     */
    destroy: function() {
      var account = this.getAccount();
      var wasNew = this.isNew();
      var signedAmount = this.getSignedAmount();

      return Parent.prototype.destroy.apply(this, arguments).then(function(rc) {
        if (!wasNew) {
          BalanceCalculator.deductFromAccountBalance(account, signedAmount);
        }

        return rc;
      });
    },

    toProps: function() {
      var props, account;

      account = this.getAccount();

      props = this.pick('id', 'type', 'note', 'amount', 'currency', 'links', 'splits', 'committed', 'transfer');
      props.isNew = this.isNew();
      props.occurredOn = this.get('occurred_on');
      props.categoryIds = this.get('category_ids');
      props.paymentMethodId = this.get('payment_method_id');
      props.attachments = this.attachments.toProps();
      props.coefficient = this.getCoefficient();

      if (account) {
        props.signedAmount = this.getSignedAmount();
        props.accountLabel = account.get('label');
      }

      if (props.transfer) {
        props.transfer = convertCase.camelize(props.transfer);
      }

      return props;
    },

    toPsync: function(isUpdating) {
      var data = this.pick([
        'id', 'type', 'note', 'amount', 'currency', 'occurred_on',
        'payment_method_id', 'category_ids'
      ]);

      if (isUpdating) {
        delete data.id;
        delete data.type;
      }

      return data;
    }
  });
});
