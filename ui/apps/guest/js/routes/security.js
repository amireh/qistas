define(function(require) {
  var Route = require('routes/secondary');
  var View = require('jsx!../views/security');
  new Route('guest:security', {
    views: [{ component: View, into: 'dialogs' }]
  });
});