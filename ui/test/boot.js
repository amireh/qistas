define(function(require) {
  var $ = require('jquery');
  var config = require('config');
  var initialize = require('config/initializer');

  return function boot(launchTests) {
    localStorage.clear();
    $.CORS({ host: '' });

    config.onLoad(function() {
      initialize().then(launchTests);
    });
  };
});