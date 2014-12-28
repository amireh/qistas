define([
  'ext/pixy', 'bundles/routes', 'constants', 'rsvp'
], function(Pixy, RouteBundle, K, RSVP) {
  'use strict';

  var router = Pixy.ApplicationRouter;
  var notFound = RouteBundle.routeMap.notFound;

  RouteBundle.setup(router);

  router.getHandler = function(name) {
    return RouteBundle.routeMap[name] || notFound;
  };
});