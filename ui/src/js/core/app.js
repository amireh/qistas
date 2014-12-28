define(function(require) {
  var Pixy = require('pixy');
  var App = Pixy.Object.extend({
    defaults: {
      name: undefined,

      /**
       * @property {String} rootRoute
       * Name of the starting route your app defines.
       *
       * Defaults to "app:app_name".
       */
      rootRoute: undefined,
    },

    constructor: function() {
      var name = this.name;

      if (!name || typeof name !== 'string') {
        throw new Error('A name must be specified for a app.');
      }

      if (this.initialize) {
        this.initialize();
      }

      return this;
    },

    getRootRouteName: function() {
      return ['app', this.name].join(':');
    },

    // setup: function(match) {}
  });

  return App;
});