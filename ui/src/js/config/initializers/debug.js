define(function(require) {
  var GLOBAL = this;

  if (GLOBAL.PIXY_TEST) {
    return;
  }

  var CONFIG = require('config');
  var _ = require('ext/underscore');
  var Pixy = require('ext/pixy');
  var Psync = require('psync');
  var RSVP = require('rsvp');
  var diff = require('util/diff');
  var DEBUG = {};

  // wait for local dev config to be loaded
  var injectScript = function(src) {
    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = src;
    document.body.appendChild(node);
  };

  // CSS live reload:
  injectScript(CONFIG.liveReloadHost + "/livereload.js");

  // Weinre for phones and tablets:
  // if (!!navigator.userAgent.match(/iPad|iPhone|Android/)) {
  //   injectScript(CONFIG.weinreHost + "/target/target-script-min.js#anonymous");
  // }

  // DEBUG.initWithSession = function(session) {
  //   session.user.accounts.on('change:active', function(account) {
  //     this.debug('Account ', account.get('label') || account.cid, 'is now',
  //       account.get('active') ? 'active' : 'inactive');
  //   });
  // };

  // Pixy.Registry.addDependency('state', DEBUG);
  // Pixy.Registry.addDependency('currencies', DEBUG);
  // Pixy.Registry.addDependency('session', DEBUG);
  // Pixy.Registry.addDependency('user', DEBUG);
  // Pixy.Registry.addDependency('bugReporter', DEBUG);
  // Pixy.Registry.addDependency('notifier', DEBUG);


  Object.defineProperty(DEBUG, 'layout', {
    get: function() {
      if (!this.__layout) {
        this.__layout = {};
      }

      Pixy.routeMap.root.ready(function(_layout) {
        this.__layout = _layout;
      }.bind(this));

      return this.__layout;
    }
  });

  Object.defineProperty(DEBUG, 'account', {
    get: function() {
      return DEBUG.user.getActiveAccount();
    }
  });

  Object.defineProperty(DEBUG, 'transactions', {
    get: function() {
      return DEBUG.account.transactions;
    }
  });

  Object.defineProperty(DEBUG, 'recurrings', {
    get: function() {
      return DEBUG.account.recurrings;
    }
  });

  DEBUG.TRACE = function() {
    try {
      throw new Error();
    } catch (e) {
      console.debug('@TRACE@');
      console.debug(e.stack);
    }
  };

  DEBUG.diff = function(_a, _b) {
    var output;
    var clone = _.clone;
    var a, b;

    a = clone(_a || {});
    b = clone(_b || {});

    try {
      output = JSON.stringify(diff.rusDiff(a, b));
    } catch(e) {
      console.warn('Unable to diff:', e.message);
      // console.warn(e.stack);

      // console.debug(typeof a, typeof b);
      // console.debug(a);
      // console.debug(b);

      DEBUG._diffA = a;
      DEBUG._diffB = b;

      return;
    }

    return output;
  };

  DEBUG.expose = function(path, name, callback) {
    if (arguments.length < 2) {
      throw "Must provide a filepath and a variable name to expose into";
    }

    require([path], function(__var) {
      DEBUG[name] = __var;

      if (callback) {
        callback(__var);
      }
    });
  };

  DEBUG.dumpProps = function() {
    return Pixy.routeMap.root.applicationLayout.promise._detail.props;
  };

  DEBUG.updateProps = function(props) {
    Pixy.routeMap.root.trigger('update', props);
  };

  // Add ?debug=true to pathname if you don't want the journal entries to be
  // discarded on successful commits.
  Psync.configure('debug', !!location.search.match(/debug/));

  // DEBUG.expose('stores/app', 'appStore', function(appStore) {
  //   appStore.dumpState = function() {
  //     return {
  //       currentPrimaryRoute: this.currentPrimaryRoute(),
  //       currentSecondaryRoute: this.currentSecondaryRoute(),
  //       previousPrimaryRoute: this.previousPrimaryRoute()
  //     };
  //   };
  // });

  DEBUG.expose('core/current_user', 'user');
  // DEBUG.expose('config', 'config');
  // DEBUG.expose('pikaday', 'pikaday');
  // DEBUG.expose('humane', 'humane');
  // DEBUG.expose('dropzone', 'dropzone');
  // DEBUG.expose('core/environment', 'env');
  // DEBUG.expose('store', 'StoreJS');
  // DEBUG.expose('react', 'React');
  // DEBUG.expose('rsvp', 'RSVP');
  // DEBUG.expose('faye', 'Faye');
  // DEBUG.expose('psync', 'Psync');
  // DEBUG.expose('stores/sessions', 'sessionStore');
  // DEBUG.expose('actions/routes', 'routeActions');
  // DEBUG.expose('stores/accounts', 'accountStore');
  // DEBUG.expose('stores/notifications', 'notificationStore');
  // DEBUG.expose('stores/realtime', 'realtimeStore');
  // DEBUG.expose('stores/transactions', 'transactionStore');
  // DEBUG.expose('util/generate_uuid', 'generateUUID');
  // DEBUG.expose('actions/analytics', 'analytics');
  // DEBUG.expose('util/keymapper', 'keymapper');
  // DEBUG.expose('i18next', 'i18next');

  GLOBAL.DEBUG = GLOBAL.d = DEBUG;

  console.info("Pibi.js is running in development mode.");

  return DEBUG;
});