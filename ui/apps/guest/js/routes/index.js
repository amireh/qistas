define(function(require) {
  var Route = require('routes/base');
  var View = require('jsx!../views/index');
  var moment = require('moment');
  var K = require('constants');

  return new Route('guest:index', {
    accessPolicy: 'public',
    views: [{ component: View }],

    enter: function() {
    }
  });
});