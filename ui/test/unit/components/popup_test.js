define(function(require) {
  var Subject = require('jsx!components/popup');
  var React = require('react');

  describe('Components::Popup', function() {
    this.reactSuite({
      type: Subject,
      initialProps: {
        content: React.DOM.div
      }
    });

    it('should render', function() {
      expect(subject.isMounted()).toEqual(true);
    });
  });
});