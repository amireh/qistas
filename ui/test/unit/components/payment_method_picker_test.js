define(function(require) {
  var Subject = require('jsx!components/payment_method_picker');

  describe('Components::PaymentMethodPicker', function() {
    this.reactSuite({
      type: Subject
    });

    it('should render', function() {
      expect(subject.isMounted()).toEqual(true);
    });
  });
});