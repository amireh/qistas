define([ 'ext/underscore', 'ext/pixy' ], function(_, Pixy) {

    /**
   * @class  Pibi.Models.Currency
   * @extends Pixy.Model
   *
   * Currency.
   *
   * @alternateClassName Currency
   */
  return Pixy.Model.extend({
    name: 'Currency',
    idAttribute: 'name',
    urlRoot: '/currencies',

    /**
     * Convert an amount from another currency into this one.
     */
    from: function(amount, currencyOrIso) {
      var target = this._lookup(currencyOrIso);

      return _.toFloat( (target.toUSD(amount) * this.get('rate') ) );
    },

    /**
     * Convert an amount from this currency into another.
     */
    to: function(amount, currencyOrIso) {
      var target = this._lookup(currencyOrIso);

      return target.from(amount, this);
    },

    /**
     * Convert an amount in this currency to the normal, USD rate.
     *
     * @private
     */
    toUSD: function(amount) {
      return _.toFloat(amount / (this.get('rate') || 1.0 /* avoid div/0 */));
    },

    _lookup: function(currencyOrIso) {
      var currency = currencyOrIso;

      if (_.isString(currency)) {
        currency = this.collection.get(currencyOrIso);
      }

      if (!currency) {
        throw new Error("Unknown currency '" + currencyOrIso + "'");
      }

      return currency;
    }
  });
});