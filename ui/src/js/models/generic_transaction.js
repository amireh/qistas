define(function(require) {
  var _ = require('ext/underscore');
  var Parent = require('ext/pixy').Model;
  var Attachments = require('collections/attachments');
  var BalanceCalculator = require('./balance_calculator');

  /**
   * @class  Pibi.Models.GenericTransaction
   * @extends Pixy.DeepModel
   * @alternateClassName GenericTransactionModel
   *
   * A basis that can be used for income, expense, and recurring transactions.
   */
  return Parent.extend({
    name: 'GenericTransaction',
    types: [ 'expense', 'income', 'recurring' ],

    initialize: function() {
      this._initialize();
    },

    // Just because Pixy is so retarded as to call #parse before #initialize
    // so if we're populating with initial data, we need to initialize associations
    // from #parse, otherwise we need to do it from #initialize ... yeah.
    _initialize: function() {
      if (!this.attachments) {
        this.attachments = new Attachments();
        this.attachments.transaction = this;
      }
    },

    /**
     * Make sure that the transaction has a positive amount and a recognizable
     * type.
     *
     * @param  {Object} data The JSON transaction construct.
     * @return {Object/Boolean}
     *  False when the transaction is valid, Object when there's a validation
     *  error. The object will contain the erratic field as a key, and an error
     *  message as its value.
     */
    validate: function(data) {
      if (!data.amount || _.toFloat(data.amount) <= 0.0) {
        return {
          amount: '[TX:BAD_AMOUNT] Transaction amount must be a positive number.'
        };
      }

      return false;
    },

    getAccount: function() {
      return (this.collection || {}).account;
    },

    getUser: function() {
      var account = this.getAccount();

      if (account) {
        return (account.collection || {}).user;
      }
    },

    /**
     * Convert the transaction's amount into an amount in the account's currency.
     *
     * @param  {Float} [amount=null]
     *         A custom amount to use, otherwise the transaction's amount is
     *         used.
     *
     * @param  {String} [currency=null]
     *         A custom currency to use, otherwise the transaction's currency
     *         is used.
     *
     * @return {Float}
     *         The signed, converted amount.
     */
    toAccountCurrency: function() {
      return BalanceCalculator.toAccountCurrency(this.get('amount'),
        this.get('currency'),
        this.getAccount());
    },

    getCoefficient: function() {
      return 1;
    },

    getSignedAmount: function() {
      return this.toAccountCurrency() * this.getCoefficient();
    },

    parse: function(data) {
      this._initialize();

      if (data.attachments) {
        this.attachments.reset(data.attachments);
      }

      return Parent.prototype.parse.apply(this, arguments);
    },

    _assignDefaults: function() {
      var account, user, paymentMethod;
      var attrs = Parent.prototype._assignDefaults.apply(this, arguments);

      if (!attrs.currency) {
        account = this.getAccount();

        if (account) {
          attrs.currency = account.get('currency');
        }
      }

      if (!(attrs.payment_method_id || '').length) {
        user = this.getUser();

        if (user) {
          paymentMethod = user.defaultPaymentMethod();

          if (paymentMethod) {
            attrs.payment_method_id = paymentMethod.get('id');
          }
        }
      }

      return attrs;
    }
  });
});
