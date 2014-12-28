define([
  'pixy', 'constants', 'actions/routes'
], function(Pixy, K, RouteActions) {
  var router = Pixy.ApplicationRouter;

  function isSecondary(route) {
    return route.isSecondary;
  }

  function routeLayer(route) {
    return isSecondary(route) ? K.APP_SECONDARY_LAYER : K.APP_PRIMARY_LAYER;
  }

  return {
    enter: function() {
      var transition = router.activeTransition;
      var layer = routeLayer(this);

      if (transition.targetName === this.name) {
        RouteActions.trackRoute(transition.intent.url, layer);
      }
    },
    exit: function() {
      if (isSecondary(this)) {
        RouteActions.trackRoute(undefined, K.APP_SECONDARY_LAYER);
      }
    }
  };
});