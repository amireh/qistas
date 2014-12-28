define(function(require) {
  var Pixy = require('pixy');
  var RSVP = require('rsvp');

  var Messenger = Pixy.Object.extend({
    name: 'Messenger',

    initialize: function() {
      this._handlers = {};
    },

    /**
     * Add a Realtime message handler.
     *
     * @param {String} code
     *        Unique message code.
     *
     * @param {Function} handler
     *        The message handler.
     *
     * @param {Object} handler.message
     *        The message that was received.
     */
    addHandler: function(code, handler) {
      if (!this._handlers[code]) {
        this._handlers[code] = [];
      }

      this._handlers[code].push(handler);
    },

    /**
     * Handle a Realtime message.
     *
     * @param {Object} message
     *        The Realtime message from Faye.
     *
     * @param {String} message.code (required)
     *        The unique message code.
     *
     * @param {Object} [message.params={}]
     *        Any message-specific params.
     *
     * @return {RSVP.Promise}
     *         Resolves once any and all handlers are done executing
     *         successfully. Rejects if either no handlers are registered for
     *         the given message, or any of the handlers fails.
     */
    handle: function(message) {
      var handlers = this._handlers[message.code];
      var promises = [];
      var code = message.code;
      var params = message.params;
      var selfOrigin;
      var svc;

      selfOrigin = message.client_id === this.clientId;

      console.debug('Messenger: got a message from Faye!', code, message);
      console.debug('Messenger: message originated from client:', message.client_id);
      console.debug('Messenger:\tme?', selfOrigin);

      if (!handlers) {
        console.warn('Unknown message "' + code + '"');
        console.debug(message);

        return RSVP.reject();
      }

      console.debug('\tInvoking:', handlers.length, 'handlers.');

      handlers.forEach(function(handler) {
        promises.push(RSVP.Promise.cast(handler(params, selfOrigin)));
      });

      svc = RSVP.all(promises);
      svc.finally(function() {
        console.debug('Messenger: handling of', code, 'is done.');
        this.trigger('done:' + code);
      }.bind(this));

      return svc;
    },

    addListener: function(code, callback) {
      this.on('done:' + code, callback);
    }
  });

  return new Messenger();
});