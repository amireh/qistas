define(function(require) {
  var Pixy = require('ext/pixy');
  var _ = require('underscore');
  var K = require('constants');
  var RSVP = require('rsvp');
  var ResourceManagerMixin = require('mixins/stores/resource_manager');
  var user = require('core/current_user');
  var analytics = require('actions/analytics');

  var store, collection;

  collection = user.accounts;

  function assertAccount(account, id) {
    if (!account) {
      return RSVP.reject('Account with id ' + id + ' could not be resolved.');
    }

    return RSVP.resolve(account);
  }

  function get(id) {
    return collection.get(id);
  }

  store = new Pixy.Store('accounts', {
    collection: user.accounts,

    /**
     * Fetch all user accounts from the API.
     *
     * @return {RSVP.Promise}
     */
    fetch: function() {
      return collection.fetch({ silent: true, parse: true }).then(function() {
        store.emitChange();

        return store.getAll();
      });
    },

    /**
     * Get a account by id.
     *
     * @param  {String} id
     * @return {Object}
     */
    get: function(id) {
      return get(id).toProps();
    },

    /**
     * Get the set of all the accounts for the current user.
     *
     * @return {Object[]}
     */
    getAll: function() {
      return collection.toProps();
    },

    /**
     * The account currently marked as active.
     *
     * @return {String|undefined}
     */
    activeAccountId: function() {
      var activeAccount = user.getActiveAccount();

      if (activeAccount) {
        return activeAccount.get('id');
      }
    },

    getActiveAccount: function() {
      var activeAccount = user.getActiveAccount();

      if (activeAccount) {
        return activeAccount;
      }
    },

    getDefaultCurrency: function() {
      var activeAccount = user.getActiveAccount();

      if (activeAccount) {
        return activeAccount.get('currency');
      }
      else {
        return 'USD';
      }
    },

    actions: {
      add: ResourceManagerMixin.add,
      activate: function(params, onChange, onError) {
        var account = get(params.id);

        assertAccount(account, params.id).then(function() {
          user.setActiveAccount(account);

          this.trigger('change:activeAccountId', params.id);
          onChange();
        }.bind(this)).catch(onError);
      },

      save: ResourceManagerMixin.save,
      remove: ResourceManagerMixin.remove
    },

    onResourceSaved: function(account, attrs, options) {
      if (options.patch) {
        analytics.updateAccount();
      }
      else {
        analytics.createAccount(attrs.balance);
      }
    },

    onResourceSaveFailure: function(account, attrs, options, error) {
      if (options.patch) {
        analytics.updateAccountFailed(error);
      }
      else {
        analytics.createAccountFailed(error);
      }
    },

    onResourceRemoved: function(account, wasNew) {
      if (!wasNew) {
        analytics.removeAccount();
      }
    },

    onResourceRemoveFailure: function(account, error) {
      analytics.removeAccountFailed(error);
    }
  });

  return store;
});