define(function(require) {
  var Pixy = require('pixy');
  var _ = require('lodash');

  var findBy = _.findWhere;

  var uniqueId = 0;

  return new Pixy.Store('actionCenter', {
    getInitialState: function() {
      return {
        messages: []
      };
    },

    getAll: function() {
      return this.state.messages;
    },

    notify: function(message, hasFailed) {
      this.state.messages.unshift({
        id: ++uniqueId,
        message: message,
        success: !hasFailed,
        unread: true
      });

      this.emitChange();
    },

    actions: {
      markAllRead: function(params, onChange) {
        this.state.messages.forEach(function(message) {
          message.unread = false;
        });

        onChange();
      },

      markRead: function(messageId, onChange) {
        var message = findBy(this.state.messages, { id: messageId });

        if (message) {
          message.unread = false;
          onChange();
        }
      },

      discard: function(messageId, onChange) {
        var messages = this.state.messages;
        var message = findBy(messages, { id: messageId });

        if (message) {
          messages.splice(messages.indexOf(message), 1);
          onChange();
        }
      }
    },
  });
});