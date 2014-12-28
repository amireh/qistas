define(function(require) {
  var Subject = require('jsx!components/simple_account_picker');

  describe('Components::SimpleAccountPicker', function() {
    this.reactSuite({
      type: Subject
    });

    it('should render', function() {
      expect(subject.isMounted()).toEqual(true);
    });
  });
});