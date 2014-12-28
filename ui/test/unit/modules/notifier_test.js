define(function(require) {
  var Notifier = window.Notifier = require('modules/notifier');
  var $ = require('jquery');

  describe ('Modules.Notifier', function() {
    beforeEach(function() {
      $('<div id="notifications" />').appendTo(jasmine.fixture);
    });

    describe('showing notifications', function() {
      it('should show a notification');
    });

    describe('#inline', function() {
      it('should work', function() {
        var $node = $('<div>Hello World</div>').appendTo(jasmine.fixture);
        Notifier.inline('Success!', $node[0]);
      });
    });
  });
});