define(function(require) {
  var Dispatcher = require('core/dispatcher');
  var UserStore = require('stores/users');
  var SessionStore = require('stores/sessions');
  var Actions = {};

  Actions.signup = function(details) {
    var svc = Dispatcher.dispatch('users:signup', details);

    svc.promise.then(function() {
      SessionStore.emitChange();
    });

    return svc;
  };

  return Actions;
});