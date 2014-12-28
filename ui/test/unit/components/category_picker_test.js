define(function(require) {
  var Subject = require('jsx!components/category_picker');

  describe('Components::CategoryPicker', function() {
    this.reactSuite({
      type: Subject
    });

    it('should render', function() {
      expect(subject.isMounted()).toEqual(true);
    });
  });
});