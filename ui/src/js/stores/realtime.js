define(function(require) {
  var Pixy = require('ext/pixy');
  var Faye = require('faye');
  var Config = require('config');
  var RSVP = require('rsvp');
  var $ = require('ext/jquery/CORS');
  var Messenger = require('core/messenger');
  var generateUUID = require('util/generate_uuid');

  var store;

  var STATUS_IDLE = 'idle';
  var STATUS_CONNECTING = 'connecting';
  var STATUS_DISCONNECTING = 'disconnecting';
  var status = STATUS_IDLE;

  /**
   * @internal A UUID to identify ourselves (this browser instance).
   *
   * This will be attached to each AJAX request as the X-Pibi-Client header.
   */
  var clientId;

  /**
   * @internal Whether the connection to Faye is known to be established.
   */
  var transportUp;

  /**
   * @internal Whether we have an active channel subscription.
   */
  var subscribed;

  /**
   * @internal The bayeux channel subscription.
   */
  var subscription;

  /**
   * @internal The Faye.Client instance, if we're connected.
   */
  var faye;

  // Prevent Faye from hooking into onbeforeunload and disconnecting the client.
  //
  // We'll also disable this manually per-client instance.
  Faye.ENV.onbeforeunload = function() {};

  $.CORS({
    mutator: function(options) {
      if (clientId) {
        options.headers['X-Pibi-Client'] = clientId;
      }
    }
  });

  var setClientId = function(id) {
    clientId = id;
    Messenger.clientId = id;
  };

  var broadcastMessage = function(message) {
    Messenger.handle(message).then(function() {
      console.debug('Faye: message', message.code, 'was handled successfully.');
    }, function(error) {
      console.error('Faye: message', message.code, 'handling failed:', error);
    });
  };


  store = new Pixy.Store('realtime', {
    toProps: function() {
      return {
        connecting: this.status === STATUS_CONNECTING,
        online: this.isOnline(),
        disconnecting: this.status === STATUS_DISCONNECTING,
      };
    },

    connect: function(channelUrl, accessToken) {
      var config = Config.faye;
      var connect = this._connect.bind(this, config.host, accessToken, config);
      var subscribe = this._subscribe.bind(this, channelUrl);
      var emitChange = this.emitChange.bind(this);
      var svc;

      status = STATUS_CONNECTING;

      svc = connect();
      svc.then(subscribe);
      svc.finally(function() {
        status = STATUS_IDLE;
        this._channelUrl = channelUrl;
        this._accessToken = accessToken;
        emitChange();
      }.bind(this));

      return svc;
    },

    disconnect: function() {
      var cancelSubscription = this._cancelSubscription.bind(this);
      var disconnect = this._disconnect.bind(this);
      var emitChange = this.emitChange.bind(this);

      status = STATUS_DISCONNECTING;

      return cancelSubscription().then(disconnect).finally(function() {
        status = STATUS_IDLE;
        this._channelUrl = undefined;
        this._accessToken = undefined;
        emitChange();
      }.bind(this));
    },

    getStatus: function() {
      return status;
    },

    isOnline: function() {
      return transportUp && subscribed;
    },

    _connect: function(host, accessToken, config) {
      var emitChange = this.emitChange.bind(this);

      faye = new Faye.Client(host, {
        extensions: [],
        retry: config.retry,
        timeout: config.timeout,
      });

      faye.disable('autodisconnect');

      faye.bind('transport:up', function() {
        console.info('Faye: connection has been established.');
        transportUp = true;
        emitChange();
      });

      faye.bind('transport:down', function() {
        console.warn('Faye: connection has been lost.');
        transportUp = false;
        emitChange();
      });

      // Stamp each outbound message with our access token.
      faye.addExtension({
        outgoing: function(message, callback) {
          message.ext = message.ext || {};
          message.ext.accessToken = accessToken;

          callback(message);
        }
      });

      return RSVP.resolve();
    },

    _subscribe: function(channelUrl) {
      var emitChange = this.emitChange.bind(this);

      subscription = faye.subscribe(channelUrl, broadcastMessage);
      subscription.then(function() {
        console.info('Faye: subscribed to private channel [%s].', channelUrl);
        setClientId(store._generateClientId());

        subscribed = true;
        emitChange();
      }, function(error) {
        console.warn('Faye: subscription failed "%o"', error);
        subscribed = false;
        emitChange();
      });

      return subscription;
    },

    _cancelSubscription: function() {
      return new RSVP.Promise(function(resolve, reject) {
        if (!subscription) {
          return resolve();
        }

        try {
          RSVP.Promise.cast(subscription.cancel()).then(function() {
            setClientId(undefined);
            subscribed = false;
            subscription = undefined;
            resolve();
          });
        } catch(e) {
          // Catch WebSocket errors.
          reject(e);
        }
      });
    },

    _disconnect: function() {
      return new RSVP.Promise(function(resolve, reject) {
        if (!faye) {
          return resolve();
        }

        try {
          RSVP.Promise.cast(faye.disconnect()).then(function() {
            clientId = undefined;
            transportUp = false;
            faye = undefined;
            resolve();
          });
        } catch(e) {
          // Catch WebSocket errors.
          reject(e);
        }
      });
    },

    _generateClientId: function() {
      var clientId;

      try {
        clientId = subscription._client._clientId;
      } catch(e) {
        clientId = generateUUID();
      }

      return clientId;
    },

    actions: {
      reconnect: function(params, onChange, onError) {
        if (status !== STATUS_IDLE) {
          return onError({ code: 'busy' });
        }
        else if (!this._channelUrl || !this._accessToken) {
          return onError({ code: 'missing_parameters' });
        }
        else if (faye) {
          return onError({ code: 'already_connected' });
        }
        else {
          return this.connect(this._channelUrl, this._accessToken).then(onChange, onError);
        }
      },

      ping: function() {
      }
    }
  });

  return store;
});