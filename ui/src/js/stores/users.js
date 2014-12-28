define(function(require) {
  var Pixy = require('ext/pixy');
  var Config = require('config');
  var K = require('constants');
  var user = require('core/current_user');
  var UIError = require('core/ui_error');
  var ajax = require('core/ajax');
  var analytics = require('actions/analytics');
  var convertCase = require('util/convert_case');
  var store;

  store = new Pixy.Store('users', {
    getEmail: function() {
      return user.get('email');
    },

    getTheme: function() {
      return localStorage.getItem('theme') || Config.defaultPreferences.user.theme;
    },

    actions: {
      /**
       * Sign up as a new user.
       *
       * @param {Object} params
       * @param {String} params.name
       *        User name.
       *
       * @param {String} params.email
       *        User email.
       *
       * @param {String} params.password
       *        User password.
       *
       * @param {Boolean} params.subscribe
       *        Whether the user wants to subscribe to newsletters and updates.
       */
      signup: function(params, onChange, onError) {
        if (!user.isNew()) {
          return onError('You are already registered.');
        }

        user.save({
          name: params.name,
          email: params.email,
          password: params.password,
          password_confirmation: params.password,
          subscribe: params.subscribe
        }, { wait: true, validate: true }).then(function() {
          analytics.signup(params.subscribe, params.password.length);
          onChange();
        }, function(error) {
          analytics.signupFailed(error);
          onError(error);
        });
      },

      /**
       * Update the current user's profile.
       *
       * @param {Object} params
       * @param {String} params.name
       * @param {String} params.email
       */
      updateProfile: function(params, onChange, onError) {
        user.save({
          email: params.email,
          name: params.name
        }, { patch: true, wait: true }).then(onChange, onError);
      },

      changePassword: function(params, onChange, onError) {
        user.save({
          current_password: params.current,
          password: params.password,
          password_confirmation: params.passwordConfirmation
        }, { patch: true, wait: true }).then(function() {
          analytics.changePassword(params.password.length);
          onChange();
        }, function(error) {
          analytics.changePasswordFailed(error);
          onError(error);
        });
      },

      resetPassword: function(params, onChange, onError) {
        ajax({
          url: '/users/reset_password',
          data: {
            email: params.email
          }
        }).then(function() {
          analytics.resetPassword();
          onChange();
        }, function(apiError) {
          var error;

          analytics.resetPasswordFailed(apiError);

          if (apiError.status === 404) {
            error = new UIError({
              code: 'not_found'
            });
          }
          else {
            error = new UIError({
              code: 'unexpected',
              details: apiError.responseJSON
            });
          }

          onError(error);
        });
      },

      changeResettedPassword: function(payload, onChange, onError) {
        var params = {};

        params.reset_password_token = payload.code;
        params.password = payload.password;
        params.password_confirmation = payload.passwordConfirmation;

        ajax({
          url: '/users/change_password',
          type: 'POST',
          data: JSON.stringify(params)
        }).then(function() {
          analytics.changeResettedPassword();
          onChange();
        }, function(resp) {
          var message = resp.responseJSON.message;
          var fieldError;

          analytics.changeResettedPasswordFailed(resp);

          if (message === 'Missing required parameter :reset_password_token') {
            fieldError = {
              reset_password_token: {
                code: 'USR_RESET_PASSWORD_TOKEN_MISSING',
                message: 'You must enter the code.'
              }
            };
          }
          else if (message.match(/Missing required parameter :password/)) {
            fieldError = {
              password: {
                code: 'USR_PASSWORD_MISSING',
                message: 'You must provide a password.'
              }
            };
          }
          else if (resp.status === 404) {
            fieldError = {
              reset_password_token: {
                code: 'USR_BAD_RESET_PASSWORD_TOKEN',
                message: 'That code is invalid. Perhaps you have used it before?'
              }
            };
          }

          if (fieldError) {
            onError({
              fieldErrors: fieldError
            });
          } else {
            onError(resp);
          }
        });
      },

      verifyEmail: function(params, onChange, onError) {
        ajax({ url: user.get('links.verify_email') }).then(onChange, onError);
      },

      addCurrency: function(params, onChange, onError) {
        user.addCurrency(params.name).then(function() {
          analytics.addCurrency();
          onChange();
        }, function(error) {
          analytics.addCurrencyFailed(error);
          onError(error);
        });
      },

      removeCurrency: function(params, onChange, onError) {
        user.removeCurrency(params.name).then(function() {
          analytics.removeCurrency();
          onChange();
        }, function(error) {
          analytics.removeCurrencyFailed(error);
          onError(error);
        });
      },

      setTheme: function(theme, onChange) {
        if (theme !== localStorage.getItem('theme')) {
          localStorage.setItem('theme', theme);
          analytics.changeTheme(theme);
        }

        onChange();
      },

      savePreferences: function(payload, onChange, onError) {
        user.savePreferences(payload).then(onChange, onError);
      },

      updatePolicy: function(payload, onChange, onError) {
        var policy = user.privacyPolicy;
        var params = policy.fromProps(payload);

        policy.save(params, {
          wait: true,
          validate: false,
          patch: true,
          parse: true
        }).then(onChange, onError);
      },

      unlinkProviderAccount: function(provider, onChange, onError) {
        ajax({
          type: 'DELETE',
          url: user.get('links.unlink_provider'),
          data: JSON.stringify({
            provider: provider
          })
        }).then(function() {
          user.fetch().then(onChange, onError);
        }, onError);
      }
    }
  });

  return store;
});