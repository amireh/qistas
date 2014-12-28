define([ 'ext/pixy', 'models/currency' ], function(Pixy, Currency) {
  var CacheableMixin = Pixy.Mixins.Cacheable;

  /**
   * @class  Pibi.Collections.Currencies
   * @singleton
   * @extends Pixy.Collection
   *
   * Currency set available in the API.
   *
   * @alternateClassName Currencies
   */
  var Currencies = Pixy.Collection.extend(CacheableMixin, {
    model: Currency,

    cache: {
      key: 'currencies',
      usePrefix: false,
      manual: true,
      events: {
        updateOn: 'fetch'
      }
    },

    url: '/currencies',
    defaultCurrency: 'USD',

    reset: function() {
      var rc = Pixy.Collection.prototype.reset.call(this);
      this.add([{ name: 'USD', rate: 1.0 }]);

      return rc;
    },

    parse: function(payload) {
      // localStorage may contain a scoped payload carrying over from the v2
      // series so we need to properly detect that, otherwise the app will
      // blow up thinking currencies *are* cached (which they are) but won't
      // understand how to load them:
      if (payload.currencies) {
        return payload.currencies;
      }
      else {
        return payload;
      }
    }
  });

  return new Currencies([], { reset: true });
});
