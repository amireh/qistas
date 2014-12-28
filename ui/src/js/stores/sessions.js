define(function(require) {
  var Pixy = require('ext/pixy');
  var RSVP = require('rsvp');
  var K = require('constants');
  var $ = require('ext/jquery/CORS');
  var ajax = require('core/ajax');
  var user = require('core/current_user');
  var RealtimeStore = require('stores/realtime');
  var AnalyticsAdapter = require('modules/analytics');
  var analytics = require('actions/analytics');

  var store, authToken;
  var tearingDown;

  $.CORS({
    mutator: function(options) {
      if (authToken) {
        options.headers.Authorization = authToken;
      }
    }
  });

  store = new Pixy.Store('session', {
    isActive: function() {
      return !!user.get('id');
    },

    isTearingDown: function() {
      return !!tearingDown;
    },

    fetch: function() {
      return new RSVP.Promise(function(resolve, reject) {
        this.actions.login.call(this, {}, resolve, reject);
      }.bind(this));
    },

    getUserId: function() {
      return user.get('id');
    },

    getAccessToken: function() {
      var apiToken = user.accessTokens.findWhere({ udid: 'realtime' });

      if (apiToken) {
        return apiToken.get('digest');
      }
    },

    getRealtimeChannel: function() {
      return user.get('realtime_channel');
    },

    reset: function() {
      user.clear();
      tearingDown = false;
      authToken = undefined;
    },

    actions: {
      /**
       * Authenticate your client session with the Pibi API.
       *
       * @param {Object} payload
       * @param {String} payload.email
       *        User email.
       *
       * @param {String} payload.password
       *        User password.
       */
      login: function(payload, onChange, onError) {
        if (!payload.refresh) {
          authToken = btoa(payload.email + ":" + payload.password);
        }

        user.fetch({ url: '/users/self' }).then(function() {
          var channelUrl = store.getRealtimeChannel();
          var accessToken = store.getAccessToken();

          AnalyticsAdapter.login(user.get('id'), user.get('name'),
            user.firstName(),
            user.lastName(),
            user.get('email'),
            user.get('plan'));

          analytics.login('pibi');

          return RealtimeStore.connect(channelUrl, accessToken).finally(onChange);
        }, function(error) {
          analytics.loginFailed(error);
          onError();
        });
      },

      /**
       * Log out.
       *
       * This always succeeds.
       */
      logout: function(params, onChange) {
        ajax({ url: '/sessions', type: 'DELETE' }).finally(function() {
          authToken = undefined;

          console.warn('Tearing down.');

          tearingDown = true;
          user.clear();
          AnalyticsAdapter.logout();
          RealtimeStore.disconnect().finally(function() {
            tearingDown = false;
            console.warn('Done.');
            onChange();
          });
        });
      }
    }
  });

  return store;
});