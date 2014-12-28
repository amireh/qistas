define(function(require) {
  var Pixy = require('ext/pixy');
  var RSVP = require('rsvp');
  var User = require('core/current_user');
  var ajax = require('core/ajax');
  var moment = require('moment');
  var K = require('constants');

  return new Pixy.Store('dashboard', {
    actions: {
    },

    toProps: function() {
      return {};
    }
  });
});