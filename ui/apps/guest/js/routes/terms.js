define(function(require) {
  var Route = require('routes/base');
  var View = require('jsx!../views/terms');

  new Route('guest:terms', {
    views: [{ component: View }]
  });
});