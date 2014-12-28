define(function(require) {
  var Subject = require('jsx!components/chosen');

  describe('Components::Chosen', function() {
    this.reactSuite({
      type: Subject
    });

    it('should render', function() {
      expect(subject.isMounted()).toEqual(true);
    });
  });
});