define([ 'ext/pixy', 'stores/app', 'stores/sessions', 'constants' ],
function(Pixy, AppStore, SessionStore, K) {
  var router = Pixy.ApplicationRouter;
  var dispatcher = Pixy.Dispatcher;

  var transitionTo = function(destination, followRedirects) {
    return router.loadAndTransitionTo(destination, followRedirects);
  };

  var home = function() {
    var destination = SessionStore.isActive() ?
      K.DEFAULT_PRIVATE_ROUTE :
      K.DEFAULT_PUBLIC_ROUTE;

    console.debug('RouteActions: going home.');

    return transitionTo('/');
  };

  var goToDestinationOrHome = function(destination) {
    var targetHandler;

    if (destination) {
      console.debug('RouteActions:\tdestination:', destination);

      if (router.hasRoute(destination)) {
        targetHandler = router.getHandler(destination);

        if (!targetHandler.isAccessible()) {
          console.warn('\tDestination is not accessible, going back home.');
          return home();
        }
      }

      return transitionTo(destination, true).catch(home);
    } else {
      console.debug('RouteActions:\tdestination unavailable, going back home.');
      return home();
    }
  };

  return {
    /**
     * Transition back to the previous primary view.
     */
    back: function() {
      console.debug('RouteActions: going back.');
      return goToDestinationOrHome(AppStore.previousPrimaryRoute());
    },

    home: home,

    /**
     * Transition back to the current primary view, assuming we're in a
     * secondary one.
     */
    backToPrimaryView: function() {
      console.debug('RouteActions: going back to primary route.');
      return goToDestinationOrHome(AppStore.currentPrimaryRoute());
    },

    trackRoute: function(url, layer) {
      dispatcher.dispatch('app:trackRoute', {
        route: url || '/',
        layer: layer
      });
    }
  };
});