define(function(require) {
  var Pixy = require('ext/pixy');

  var Progress = Pixy.Model.extend({
    baseUrl: '/progresses'
  });

  return Progress;
});