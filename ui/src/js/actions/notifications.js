define(function(require) {
  var K = require('constants');
  var Dispatcher = require('core/dispatcher');

  var actions = {
    dismiss: function(id) {
      Dispatcher.dispatch('notifications:dismiss', id);
    }
  };

  return actions;
});