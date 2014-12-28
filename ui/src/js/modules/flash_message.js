  define(function(require) {
  var $ = require('jquery');
  var _ = require('underscore');
  var extend = _.extend;

  var create = function() {
    return $('<span />', { class: 'inline-notification' });
  };

  var Flash = function(node, message, options) {
    var $container = $('#notifications');
    var $notification = create();
    var $node = $(node);
    var offset, adjust;

    if (arguments.length === 2) {
      options = message;
      message = options.message;
    }

    adjust = extend({}, {
      x: 0,
      y: 0
    }, options.adjust);

    if ($node.is(':visible')) {
      offset = $node.offset();
    }
    else {
      offset = $node.closest(':visible').offset();
    }

    $notification.text(message);
    $notification.appendTo($container);
    $notification.css({
      top: offset.top - $notification.outerHeight() + adjust.y,
      left: offset.left + ($node.outerWidth()/2) - ($notification.outerWidth()/2) + adjust.x
    });

    this.$notification = $notification;

    setTimeout(this.destroy.bind(this), 5000);

    return this;
  };

  Flash.prototype.destroy = function() {
    this.$notification.remove();
  };

  return Flash;
});