define(function(require) {
  var Analytics = require('modules/analytics');
  var convertCase = require('util/convert_case');
  var User = require('core/current_user');
  var privacyPolicy = User.privacyPolicy;

  var trackers = {};
  var meta = [];
  var alreadyTracked = {};

  // Queue an event to the Analytics adapter for submission.
  //
  // @options and @name are passed implicitly by the defineMetric() helper,
  // while @properties are accepted from the caller.
  var track = function(options, name, properties) {
    if (!privacyPolicy.isMetricAllowed(name)) {
      return;
    }
    else if (options.onlyOnce) {
      if (alreadyTracked[name]) {
        return;
      }

      alreadyTracked[name] = true;
    }

    Analytics.trackEvent(name, convertCase.underscore(properties));
  };

  // Submit a "Action Failed" event, where "Action" is replaced by the
  // action string that failed (e.g, "Transactions: Create")
  //
  // The error parameter could be an API error, a jQuery response object that
  // contains an API error, or a plain string.
  //
  // The tracked event will contain two properties: "code" and "message". Code
  // defaults to "unknown" if it is not present.
  var onFailure = function(error) {
    var apiError;

    // handle API errors
    if (typeof error === 'object') {
      apiError = error;

      if ('responseJSON' in error) {
        apiError = error.responseJSON || {};
      }

      this.track({ code: apiError.code || 'unknown', message: apiError.message });
    }
    else {
      this.track({ code: 'unknown', message: error });
    }
  };

  var defineMetric = function(name, handlerName, handler, options) {
    options = options || {};

    var context = { track: track.bind(null, options, name) };
    var failureContext = { track: track.bind(null, options, name + ' Failed') };

    trackers[handlerName] = handler.bind(context);
    trackers[handlerName + 'Failed'] = onFailure.bind(failureContext);

    meta.push({
      id: handlerName,
      name: name,
      onlyOnce: !!options.onlyOnce,
    });
  };

  defineMetric('Transactions: Create', 'createTransaction', function(type, amount) {
    this.track({ type: type, amount: amount });
  });

  defineMetric('Transactions: Update', 'updateTransaction', function(type, amount) {
    this.track({ type: type, amount: amount });
  });

  defineMetric('Transactions: Remove', 'removeTransaction', function() {
    this.track();
  });

  defineMetric('Transactions: CSV', 'generateTransactionCSV', function() {
    this.track();
  });

  defineMetric('Transactions: Transfer', 'createTransfer', function() {
    this.track();
  });

  defineMetric('Transactions: Filter', 'filterTransactions', function(usedFilters) {
    this.track(usedFilters);
  }, { onlyOnce: true });

  defineMetric('Accounts: Create', 'createAccount', function(startingBalance) {
    this.track({
      // are people using the starting balance modifier?
      //
      // keeping it as a number so that we can see if people are creating
      // accounts with a negative starting balance
      startingBalance: startingBalance
    });
  });

  defineMetric('Accounts: Update', 'updateAccount', function() {
    this.track();
  });

  defineMetric('Accounts: Remove', 'removeAccount', function() {
    this.track();
  });

  defineMetric('Categories: Create', 'createCategory', function(name, icon) {
    this.track({
      // would be nice to see if there are popular categories we're missing
      name: name,

      // are people using icons?
      icon: icon,
    });
  });

  defineMetric('Categories: Update', 'updateCategory', function(name, icon) {
    this.track({
      // this should be unpopular...
      name: name,

      // are people changing icons?
      icon: icon,
    });
  });

  defineMetric('Categories: Remove', 'removeCategory', function() {
    this.track();
  });

  defineMetric('Payment Methods: Create', 'createPaymentMethod', function(name, color) {
    this.track({
      name: name,
      color: color,
    });
  });

  defineMetric('Payment Methods: Update', 'updatePaymentMethod', function(name, color) {
    this.track({
      name: name,
      color: color,
    });
  });

  defineMetric('Payment Methods: Remove', 'removePaymentMethod', function() {
    this.track();
  });

  defineMetric('Password Reset', 'resetPassword', function() {
    this.track();
  });

  defineMetric('Change Resetted Password', 'changeResettedPassword', function() {
    this.track();
  });

  defineMetric('Change Theme', 'changeTheme', function(theme) {
    this.track({ theme: theme });
  });

  defineMetric('Currencies: Add To List', 'addCurrency', function() {
    this.track();
  }, { onlyOnce: true });

  defineMetric('Currencies: Remove From List', 'removeCurrency', function() {
    this.track();
  }, { onlyOnce: true });

  defineMetric('Users: Signup', 'signup', function(newsletterSubscription, passwordLength) {
    this.track({
      newsletterSubscription: !!newsletterSubscription,
      passwordLength: passwordLength
    });
  });

  defineMetric('Change Password', 'changePassword', function(passwordLength) {
    this.track({
      passwordLength: passwordLength
    });
  });

  defineMetric('Login', 'login', function(provider) {
    this.track({
      provider: provider
    });
  });

  defineMetric('Recurrings: Create', 'createRecurring', function(flowType, frequency, usingEvery) {
    this.track({
      flowType: flowType,
      frequency: frequency,
      usingEvery: !!usingEvery
    });
  });

  defineMetric('Recurrings: Update', 'updateRecurring', function() {
    this.track();
  });

  defineMetric('Recurrings: Activate', 'activateRecurring', function() {
    this.track();
  }, { onlyOnce: true });

  defineMetric('Recurrings: Deactivate', 'deactivateRecurring', function() {
    this.track();
  }, { onlyOnce: true });

  defineMetric('Recurrings: Remove', 'removeRecurring', function() {
    this.track();
  });

  defineMetric('Attachments: Upload', 'uploadAttachment', function(fileType, fileSize) {
    this.track({
      fileType: fileType,
      fileSize: fileSize
    });
  });

  defineMetric('Attachments: Remove', 'removeAttachment', function() {
    this.track();
  });

  defineMetric('Attachments: Limit Exceeded', 'attachmentLimitExceeded', function() {
    this.track();
  });

  trackers.getMetrics = function() {
    return meta.map(function(metric) {
      metric.active = privacyPolicy.isMetricAllowed(metric.name);

      return metric;
    });
  };

  return trackers;
});