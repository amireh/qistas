define(function(require) {
  var _ = require('ext/underscore');
  var Pixy = require('ext/pixy');
  var Accounts = require('collections/accounts');
  var Categories = require('collections/categories');
  var PaymentMethods = require('collections/payment_methods');
  var Currencies = require('collections/currencies');
  var Budgets = require('collections/budgets');
  var Progress = require('models/progress');
  var PrivacyPolicy = require('models/privacy_policy');
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
       * @property {Collections.Accounts} accounts
       * Available accounts for this user.
       */
      this.accounts = new Accounts();
      this.accounts.user = this;
      this.accounts.add([{}]);
      // Make sure the account's currency is in our available currency list
      this.accounts.on('add change:currency', this._addAccountCurrency, this);
      // Refresh the active account.
      this.accounts.on('fetch reset remove', this._ensureActiveAccount, this);

      /**
       * @property {Pixy.Collection} accessTokens
       * Available API access tokens for this user.
       */
      this.accessTokens = new Pixy.Collection();

      /**
       * @property {Collections.Categories} categories
       * Available categories for this user.
       */
      this.categories = new Categories();
      this.categories.user = this;

      /**
       * @property {Collections.PaymentMethods} paymentMethods
       * Available payment methods for this user.
       */
      this.paymentMethods = new PaymentMethods();
      this.paymentMethods.user = this;

      /**
       * @property {Collections.Budgets} budgets
       * Available budgets for this user.
       */
      this.budgets = new Budgets();
      this.budgets.user = this;

      this.progresses = new Pixy.Collection(undefined, {
        model: Progress
      });

      this.privacyPolicy = new PrivacyPolicy();

      this._ensureDefaultPreferences();
      this._ensureActiveAccount();
    },

    clear: function() {
      this.accounts.reset([{}]);
      this.categories.reset();
      this.paymentMethods.reset();
      this.budgets.reset();

      return Pixy.DeepModel.prototype.clear.apply(this, arguments);
    },

    parse: function(payload) {
      if (payload.accounts) {
        this.accounts.reset(payload.accounts);
      }

      if (payload.payment_methods) {
        this.paymentMethods.reset(payload.payment_methods);
      }

      if (payload.categories) {
        this.categories.reset(payload.categories);
      }

      if (payload.budgets) {
        this.budgets.reset(payload.budgets);
      }

      if (payload.access_tokens) {
        this.accessTokens.reset(payload.access_tokens);

        delete payload.access_tokens;
      }

      if (payload.privacy_policy) {
        this.privacyPolicy.clear();
        this.privacyPolicy.set(payload.privacy_policy, {
          parse: true, validate: false
        });

        delete payload.privacy_policy;
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
     * Locate the payment method marked as default by the user, or the first one
     * available.
     *
     * @return {PaymentMethod}
     *         The payment method to use as a default.
     */
    defaultPaymentMethod: function() {
      return this.paymentMethods.findWhere({ 'default': true }) ||
        this.paymentMethods.first();
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

    activeAccount: function() {
      console.warn('Deprecated: use User#getActiveAccount() instead.');
      return this.getActiveAccount();
    },

    /**
     * The user's active account.
     *
     * @note
     * There can only be one account active at a time.
     *
     * @return {Models.Account}
     *         The active account.
     */
    getActiveAccount: function() {
      return this.accounts.findWhere({ active: true }) || this.accounts.first();
    },

    getActiveAccountId: function() {
      var activeAccount = this.getActiveAccount();

      if (!activeAccount) {
        return null;
      }
      else {
        return activeAccount.get('id');
      }
    },

    /**
     * Activate a specific account.
     *
     * @param {Models.Account} account
     *        The account to activate.
     */
    setActiveAccount: function(account) {
      if (!account) {
        throw new TypeError('Expected a valid account to activate.');
      }

      if (account.get('active')) {
        return false;
      }

      if (account.get('id')) {
        Storage.set('activeAccount', account.get('id'));
        console.debug('Storing active account:', account.get('id'));
      }

      // De-activate all accounts
      this.accounts.where({ active: true }).forEach(function(activeAccount) {
        activeAccount.set({ active: false }, { silent: true });
      });

      account.set({ active: true });

      this.trigger('change:activeAccount', account);

      return true;
    },

    /**
     * @private
     */
    _ensureActiveAccount: function() {
      var account = this.getActiveAccount();

      if (!account) {
        // Get the last active account.
        account = this.accounts.get(Storage.get('activeAccount'));

        // Just use the first one.
        if (!account) {
          console.warn("No active account in localStorage (", Storage.get('activeAccount'),"), getting first.");
          account = this.accounts.first();
        }
      }

      if (!account) {
        return;
      }

      this.setActiveAccount(account);
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

    /**
     * Retrieve the list of available currencies.
     *
     * @return {String[]}
     *         A list of ISO codes of currencies.
     */
    currenciesByISO: function() {
      return _.uniq(this.preference('currencies') || []).sort();
    },

    /**
     * Add a currency to the list of available account currencies.
     *
     * @param {Models.Currency/String} isoCode
     *        The ISO code of the currency (See Currency#name).
     *
     * @param {Object} [options={}]
     *        Options to pass to #savePreferences.
     *
     * @async
     */
    addCurrencies: function(isoCodes, options) {
      var currencies = this.currenciesByISO();

      if (!_.isArray(isoCodes)) {
        isoCodes = [ isoCodes ];
      }

      return this.setCurrencies(_.union(currencies, isoCodes), options);
    },

    /**
     * Add a single currency to the list of available currencies.
     *
     * @param {Models.Currency/String} isoCode
     *        The currency to add.
     *
     * @param {Objects} options
     *        Options to pass to #addCurrencies.
     */
    addCurrency: function(isoCode, options) {
      return this.addCurrencies([ isoCode ], options);
    },

    /**
     * @private
     */
    _addAccountCurrency: function(account) {
      this.addCurrencies([ account.get('currency') ]);
    },

    /**
     * Replace the entire set of available currencies with the given one.
     *
     * @param {Array<String>} isoCodes
     *        List of currency ISO codes to use.
     *
     * @param {Object} [options={}]
     *        Options to pass to #savePreferences.
     *
     * @throws {ReferenceError} If the set contains an unknown currency.
     */
    setCurrencies: function(isoCodes, options) {
      isoCodes = _.uniq( isoCodes );

      _.each(isoCodes, function(isoCode) {
        if (!Currencies.get(isoCode)) {
          throw new ReferenceError('Unknown currency ' + isoCode);
        }
      });

      // Make sure there's at least one currency defined.
      if (!isoCodes.length) {
        isoCodes.push(Currencies.defaultCurrency);
      }

      // Spare the API the hit, nothing has changed...
      if (_.isEqual(this.currenciesByISO().sort(), isoCodes.sort())) {
        return RSVP.resolve(isoCodes);
      }

      return this.savePreferences({ currencies: isoCodes }, options);
    },

    /**
     * Remove a currency from the available currency list.
     *
     * @param {String} isoCode The ISO code of the currency (see Currency#name).
     * @param {Object} [options={}] Options to pass to #savePreferences.
     *
     * @async
     */
    removeCurrency: function(isoCode, options) {
      var currencies = _.without(this.currenciesByISO(), isoCode);
      return this.setCurrencies(currencies, options);
    },

    dump: function() {
      return this.toJSON();
    },

    toProps: function() {
      var props = this.pick('id', 'email', 'name', 'preferences');

      props.emailVerified = this.get('email_verified');
      props.linkedProviders = this.get('linked_providers');

      return props;
    }
  });

  return User;
});