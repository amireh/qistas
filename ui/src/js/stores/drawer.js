define(function(require) {
  var Pixy = require('pixy');

  var ready = function(callback) {
    var rootRoute = Pixy.routeMap.root;

    rootRoute.ready(function() {
      callback(rootRoute);
    });
  };

  return new Pixy.Store('drawer', {
    actions: {
      attach: function(component, onChange, onError) {
        ready(function(rootRoute) {
          rootRoute.trigger('render', component, 'drawer');
          onChange();
        });
      },

      detach: function(component, onChange, onError) {
        ready(function(rootRoute) {
          rootRoute.trigger('remove', component, 'drawer');
          onChange();
        });
      },

      collapse: function(__params, onChange) {
        ready(function(rootRoute) {
          rootRoute.trigger('collapseDrawer');
          onChange();
        });
      }
    },
  });
});