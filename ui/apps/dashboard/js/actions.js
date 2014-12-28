define(function(require) {
  var Store = require('./stores/prayers');
  var Dispatcher = require('core/dispatcher');

  var Actions = {};

  Actions.save = function(params) {
    Dispatcher.dispatch('prayers:save', params);
  };

  return Actions;
});