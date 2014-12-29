define(function(require) {
  var _ = require('ext/underscore');
  var Pixy = require('ext/pixy');
  var Storage = require('store');
  var Config = require('config');
  var RSVP = require('rsvp');
  var CacheableMixin = Pixy.Mixins.Cacheable;

  /**
   * @class  Pibi.Models.User
   * @singleton
   * @extends Pixy.DeepModel
   *
   * The User object.
   *
   * @alternateClassName User
   */
  var User = Pixy.DeepModel.extend(CacheableMixin, {
    name: 'User',

    cache: {
      key:        'user',
      usePrefix:  false,
      unique:     false,
      manual:     true
    },

    psync: {
      collectionKey: 'users'
    },

    urlRoot: '/users',

    initialize: function() {
      this.on('sync', this._ensureDefaultPreferences, this);
      this.on('sync', this.updateCacheEntry, this);

      /**
       * @property {Pixy.Collection} accessTokens
       * Available API access tokens for this user.
       */
      this.accessTokens = new Pixy.Collection();

      this._ensureDefaultPreferences();
    },

    clear: function() {
      return Pixy.DeepModel.prototype.clear.apply(this, arguments);
    },

    parse: function(payload) {
      if (payload.access_tokens) {
        this.accessTokens.reset(payload.access_tokens);

        delete payload.access_tokens;
      }

      return payload;
    },

    validate: function(data) {
      if (!data.name || !data.name.length) {
        return { name: '[USR:NAME_MISSING] We need your name.' };
      }

      if (!data.email || !data.email.length || data.email.length < 3) {
        return { email: '[USR:EMAIL_MISSING] We need your email address.' };
      }

      if (this.isNew()) {
        if (!data.password || !data.password.length || data.password.length < 7) {
          return {
            password: '[USR:PASSWORD_TOO_SHORT]' +
              'Password is too short, it must be at least 7 characters long.'
          };
        }
      }

      return false;
    },

    /**
     * Shortcut accessor for a single user preference.
     *
     * @param {String} key
     *        The preference key.
     *
     * @return {Mixed/undefined}
     *         The stored preference, if found.
     */
    preference: function(key) {
      return this.get('preferences.' + key);
    },

    /**
     * Merge the user-scoped preferences with the given set of preferences.
     *
     * @param  {Object/String} preferences
     * The new preferences to commit. If `preferences` is a String, it is expected
     * to be parsable by _.parseOptions.
     *
     * @param {Object} [options={}]
     * Options to pass to Pixy.Model#save.
     *
     * @return {XMLHttpRequest}
     * the XHR object returned by Pixy.Model#save.
     *
     * Example of activating a flag "has_seen_wizard" using an Object:
     *
     *     user.update_preferences({
     *       has_seen_wizard: true
     *     });
     *
     * The same example using an options String:
     *
     *     user.update_preferences('has_seen_wizard: true');
     *
     */
    savePreferences: function(preferences, options) {
      if (_.isString(preferences)) {
        preferences = _.parseOptions(preferences);
      }
      else if (!_.isObject(preferences)) {
        throw new TypeError('Preferences must be either an Object or a String.');
      }

      options = _.extend({}, options, {
        wait: true,
        patch: true
      });

      return this.save({ preferences: preferences, no_object: true }, options);
    },

    /**
     * @private
     */
    _ensureDefaultPreferences: function() {
      var defaults = Config.defaultPreferences.user;
      this.set('preferences', _.extend({}, defaults, this.get('preferences')));
    },

    /**
     * The user's first name, if viable..
     */
    firstName: function() {
      return _.head( (this.get('name') || '').split(/\s/) );
    },

    /**
     * The user's last name, if viable.
     */
    lastName: function() {
      return _.tail( (this.get('name') || '').split(/\s/) );
    },

    dump: function() {
      return this.toJSON();
    }
  });

  return User;
});