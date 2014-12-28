define(function(require) {
  var Keymapper = require('util/keymapper');

  return {
    initialize: function() {
      Keymapper(this, this.name);
      console.log(this.name, 'keys bound.');
    },

    enter: function() {
      this.bindKeys();
    },

    exit: function() {
      this.unbindKeys();
    }
  };
});