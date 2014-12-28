define(function(require) {
  var CoreApp = require('core/app');
  var RootRoute = require('./route');
  var TrackRoute = require('./routes/track');

  return CoreApp.extend({
    name: 'dashboard',
    rootRoute: RootRoute,
    setup: function(match) {
      match('/').to(RootRoute.name);
      match('/track').to(TrackRoute.name);
    }
  });
});