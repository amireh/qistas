define(function(require) {
  var CoreApp = require('core/app');
  var RootRoute = require('./routes/root');
  var ButtonsRoute = require('./routes/buttons');

  return CoreApp.extend({
    name: 'development',
    rootRoute: RootRoute,

    setup: function(match) {
      match('/buttons').to('development:buttons');
    }
  });
});