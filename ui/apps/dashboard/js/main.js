define(function(require) {
  var CoreApp = require('core/app');
  var RootRoute = require('./route');
  var ScoreboardRoute = require('./routes/scoreboard');

  return CoreApp.extend({
    name: 'dashboard',
    rootRoute: RootRoute,
    setup: function(match) {
      match('/dashboard').to(RootRoute.name);
      match('/scoreboard').to(ScoreboardRoute.name);
    }
  });
});