Factories = (function(require) {
  var Factories = {};

  require([ 'ext/pixy' ], function(Pixy) {
    Factories.User = Pixy.Model.extend({
      initialize: function() {
        this.accounts = new Pixy.Collection();
        this.paymentMethods = new Pixy.Collection();
        this.categories = new Pixy.Collection();
      },
      defaultPaymentMethod: function() {
        return null;
      }
    });

    Factories.Account = Pixy.Model.extend({
      initialize: function() {
        this.transactions = new Pixy.Collection();
        this.recurrings = new Pixy.Collection();
        this.transactions.account = this;
        this.recurrings.account = this;
      }
    });
  });

  return Factories;
})(require);