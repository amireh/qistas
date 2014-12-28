define(function(require) {
  var Pixy = require('pixy');
  var activeId;
  var guid = 1;

  return new Pixy.Store('popups', {
    getActiveId: function() {
      return activeId;
    },

    generateUniqueId: function() {
      return ''+(guid++);
    },

    actions: {
      open: function(id, onChange, onError) {
        activeId = id;
        onChange();
      },

      close: function(__payload, onChange, onError) {
        activeId = null;
        onChange();
      }
    },
  });
});