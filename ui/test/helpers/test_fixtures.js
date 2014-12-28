Fixtures = (function(require) {
  var Fixtures = {};
  var removals = [];

  require(['test/helpers/xhr'], function(FakeXHRResponse) {
    Fixtures.FakeResponse = Fixtures.XHR = FakeXHRResponse;
  });

  afterEach(function() {
    removals.forEach(function(removal) {
      removal();
    });

    removals = [];
  });


  Fixtures.DOMElement = function(el) {
    return $(el).appendTo($('body'));
  }

  require([ 'pixy' ], function() {
    Fixtures.Listener = Pixy.Model.extend({
      a: function() {},
      b: function() {}
    });
  });

  require([ 'collections/currencies' ], function(Currencies) {
    Fixtures.addCurrency = Fixtures.Currency = function(isoCode, rate) {
      var currency = Currencies.get(isoCode);

      if (currency) {
        if (rate) {
          currency.set({ rate: rate });
        }

        return currency;
      }

      return Currencies.push({ name: isoCode, rate: rate });
    };
  });

  return Fixtures;
})(require);