define(function(require, exports, module) {
  var _ = require('underscore');
  var ProductionConfig = require('config/environments/production');
  var DefaultConfig = require('config/environments/defaults');
  var env = module.config().environment || 'development';

  var merge = _.merge;

  /**
   * @class Pibi.Config
   *
   * Application-wide configuration.
   *
   * This object is exposed to the modules after initialization of the Controller
   * via the application State.
   */
  var config = merge({}, ProductionConfig, DefaultConfig);

  //>>excludeStart("production", pragmas.production);
  var callbacks = [];

  config.onLoad = function(callback) {
    if (loaded) {
      callback();
    }
    else {
      callbacks.push(callback);
    }
  };

  var onLoad = function() {
    console.log('\tLoaded', env, 'config.');
    loaded = true;

    while (callbacks.length) {
      callbacks.shift()();
    }
  };

  // Install test config:
  if (env === 'test') {
    console.log('Environment: test.');

    require([ './config/environments/test' ], function(testConfig) {
      merge(config, testConfig);
      onLoad();
    }, onLoad);
  }
  else {
    console.log('Environment: development.');

    // Install development and local config:
    require([ './config/environments/development' ], function(devConfig) {
      merge(config, devConfig);
      onLoad();
    });

    require([ './config/environments/development_local' ], function(localConfig) {
      merge(config, localConfig);
      onLoad();
    }, function(e) {
      if (e.requireType === 'scripterror') {
        onLoad();

        // don't whine if the files don't exist:
        console.info(
          'Hint: you can set up your own private, development-only configuration in',
          '"config/environments/development_local.js".');
      } else {
        throw e;
      }
    });
  }
  //>>excludeEnd("production");

  return config;
});
