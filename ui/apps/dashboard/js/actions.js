define(function(require) {
  var Store = require('./stores/prayers');
  var Dispatcher = require('core/dispatcher');

  var Actions = {};

  Actions.save = function(params) {
    Dispatcher.dispatch('prayers:save', params);
  };

  Actions.destroy = function(type, date) {
    Dispatcher.dispatch('prayers:destroy', {
      type: type,
      date: date
    });
  };

  return Actions;
});