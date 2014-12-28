define(function(require) {
  var Pixy = require('ext/pixy');
  var RouteMixins = require('pixy/mixins/routes');
  var TrackableMixin = require('mixins/routes/trackable');

  var Route = Pixy.Route.extend({
    mixins: [
      RouteMixins.AccessPolicy,
      RouteMixins.SecondaryTransitions,
      RouteMixins.WindowTitle,
      RouteMixins.Renderer,
      RouteMixins.Props,
      TrackableMixin,
    ],

    events: {
      willTransition: function(transition) {
        RouteMixins.SecondaryTransitions.willTransition.call(this, transition);
      }
    }
  });

  return Route;
});