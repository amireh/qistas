define(function(require) {
  var Route = require('routes/base');
  var View = require('jsx!../views/buttons');

  return new Route('development:buttons', {
    views: [{ component: View }]
  });
});