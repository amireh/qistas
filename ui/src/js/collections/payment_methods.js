define([ 'ext/pixy', 'models/payment_method' ], function(Pixy, PM) {
  /**
   * @class  Pibi.Collections.PaymentMethods
   * @extends Pixy.Collection
   *
   * User payment methods.
   *
   * @alternateClassName PaymentMethods
   */
  return Pixy.Collection.extend({
    model: PM,

    url: function() {
      return this.user.get('links.payment_methods');
    }
  });
});
