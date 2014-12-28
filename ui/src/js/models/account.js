define([
  'ext/underscore',
  'ext/pixy',
  'collections/transactions',
  'collections/recurrings',
  'collections/currencies'
], function(_, Pixy, Transactions, Recurrings, Currencies) {

  var Parent = Pixy.DeepModel;

  /**
   * @class Pibi.Models.Account
   * @singleton
   * @extends Pixy.DeepModel
   *
   * User account.
   */
  return Parent.extend({
    name: 'Account',

    defaults: {
      label: 'Unlabelled Account',
      balance: 0,
      active: false,
      currency: 'USD'
    },

    psync: {
      collectionKey: 'accounts',
      scopeKey: 'user'
    },

    // cache: {
    //   key: 'account',
    //   unique: true,
    //   usePrefix: false,
    //   manual: true
    // },

    urlRoot: function() {
      return this.collection.url();
    },

    initialize: function() {
      /**
       * @property {Collections.Transactions} transactions
       * Expenses and incomes made in this account.
       */
      this.transactions = new Transactions();
      this.transactions.account = this;

      /**
       * @property {Collections.Recurrings} recurrings
       * Recurring transactions that occur in this account.
       */
      this.recurrings = new Recurrings();
      this.recurrings.account = this;

      this.on('change:currency',  this.associateCurrency, this);
      this.on('change:balance',   this.forcePrecision, this);
      this.on('sync',             this.updateCacheEntry, this);

      // Reference the default currency.
      this.associateCurrency();
    },

    /**
     * Reset the account along with its transactions and recurrings and purge
     * the cache entry.
     *
     * @fires clear
     * @fires unloaded
     */
    clear: function() {
      this.transactions.reset();
      this.recurrings.reset();

      return Parent.prototype.clear.apply(this, arguments);
    },

    /**
     * @private
     */
    associateCurrency: function() {
      var lastCurrency = this.currency;
      var newCurrency  = Currencies.get(this.get('currency'));

      if (!newCurrency) {
        throw new TypeError('Can not associate unknown currency ' + this.get('currency'));
      }

      this.currency = newCurrency;
      // this.currency.collection = Currencies;

      if (lastCurrency && newCurrency) {
        this.set({
          balance: lastCurrency.to(this.get('balance'), newCurrency)
        });
      }
    },

    /**
     * Silently coerce the balance we get from the API into a float form.
     *
     * See _.toFloat.
     *
     * @private
     */
    forcePrecision: function() {
      this.set({ balance: _.toFloat(this.get('balance')) }, {
        silent: true
      });
    }
  });
});