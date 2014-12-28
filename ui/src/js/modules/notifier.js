define(function(require) {
  var _ = require('ext/underscore');
  var Pixy = require('ext/pixy');
  var stockHumane = require('humane');
  var RSVP = require('rsvp');
  var $ = require('jquery');
  var humane;

  var Notifier = Pixy.Object.extend({
    message: function(text, options) {
      var messageRenderer = RSVP.defer();

      if (!humane) {
        humane = stockHumane.create({
          container: document.querySelector('#humane_notifications')
        });
      }

      humane.remove(function() {
        var log = humane.log(text, _.extend({}, {
          timeout: 5000,
          clickToClose: true
        }, options));

        messageRenderer.resolve(log);
      });

      return messageRenderer.promise;
    },

    info: function(text, options) {
      return this.message(text, _.extend({}, options, {
        addnCls: 'humane-libnotify-info'
      }));
    },

    success: function(text, options) {
      return this.message(text, _.extend({}, options, {
        addnCls: 'humane-libnotify-success'
      }));
    },

    error: function(text, options) {
      return this.message(text, _.extend({}, options, {
        addnCls: 'humane-libnotify-error'
      }));
    },

    confirm: function(message) {
      return new ConfirmationDialog().exec({ message: message });
    },

    inline: function(message, node) {
      var $container = $('#notifications');
      var $notification = $('<span />').addClass('inline-notification');
      var $node = $(node);
      var offset;

      if ($node.is(':visible')) {
        offset = $node.offset();
      }
      else {
        offset = $node.closest(':visible').offset();
      }

      $notification.text(message);
      $notification.appendTo($container);
      $notification.css({
        top: offset.top - $notification.outerHeight(),
        left: offset.left + ($node.outerWidth()/2) - ($notification.outerWidth()/2)
      });

      setTimeout(function() {
        $notification.remove();
      }, 5000);
    }
  });

  return new Notifier();
});