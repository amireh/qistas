define([ 'ext/underscore', 'chosen' ], function(_) {
  var defaults = {
    inherit_select_classes: true,
    disable_search: true,
    width: '100%'
  };

  return {
    create: function($selector, options) {
      var chosen;

      options = _.extend({}, defaults, options);

      $selector.chosen(options);

      if (options.minWidth) {
        chosen = $selector.data('chosen');

        if (chosen) { // chosen doesn't activate on mobile
          chosen.container.css({
            minWidth: options.minWidth
          });
        }
      }
    },

    destroy: function($selector) {
      $selector.chosen('destroy');
    },

    update: function($selector) {
      $selector.trigger('chosen:updated');
    }
  };
});