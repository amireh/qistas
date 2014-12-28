define(function(require) {
  var Pixy = require('pixy');
  var user = require('core/current_user');
  var store;

  store = new Pixy.Store('operations', {
    updateStatus: function(opId, status, completion) {
      var progress = user.progresses.get(opId);

      progress.set({
        workflow_state: status,
        completion: completion || progress.get('completion')
      });

      this.emitChange();
    },

    markComplete: function(opId) {
      user.progresses.get(opId).set({ workflow_state: 'complete' });
      this.emitChange();
    },

    getAll: function() {
      return user.progresses.toProps();
    }
  });

  user.progresses.on('add change remove', store.emiteChange, store);

  return store;
});