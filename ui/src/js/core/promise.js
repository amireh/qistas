define(function(require) {
  var RSVP = require('rsvp');
  var Promise = function(handler) {
    return new RSVP.Promise(handler);
  };

  Promise.defer = RSVP.defer;
  Promise.all = RSVP.all;
  Promise.resolve = RSVP.resolve;
  Promise.reject = RSVP.reject;

  return Promise;
});