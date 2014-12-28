//>>excludeStart("production", pragmas.production);
var startTime = new Date();
//>>excludeEnd("production");

define([
  'config/initializer',
  'underscore',
  'ext/pixy',
  'rsvp',
  'core/state',
  'stores/sessions',
  'config/initializers/locale',
  'bundles/core',
  'bundles/apps',
  'bundles/stores',
  'bundles/messages',
],
function(initialize, _, Pixy, RSVP, State, SessionStore, locale) {
  var bootLogger = new Pixy.LoggingContext('Boot');

  console.debug('Booting');

  // Load I18n data
  initialize()
  // Test the session
  .then(function() {
    return SessionStore.fetch();
  }).catch(function() {
    bootLogger.warn('Session fetching failed.');
  })
  // Start the routing engine
  .then(function() {
    return new RSVP.Promise(function(resolve, reject) {
      require([ 'config/initializers/routes' ], resolve, reject);
    });
  }).then(function() {
    // this doesn't really have anything to promise, but oh well
    return Pixy.ApplicationRouter.start({
      pushState: true,
      preload: true,
      locale: locale
    });
  })
  // Et voilà!
  .then(function() {
    // document.querySelector('#loading_screen').remove();
    //>>excludeStart("production", pragmas.production);
    bootLogger.info('Up and running in:', ((new Date()) - startTime) + 'ms');
    //>>excludeEnd("production");

    State.setup();
  })
  .catch(function(e) {
    _.defer(function() {
      bootLogger.warn('Boot error:');
      throw e;
    });
  });

  //>>excludeStart("production", pragmas.production);
  bootLogger.debug('Required in:', ( (new Date()) - startTime ) + 'ms');
  //>>excludeEnd("production");
});