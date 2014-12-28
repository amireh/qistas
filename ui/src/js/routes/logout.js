define([ 'routes/base', 'core/dispatcher' ], function(Route, Dispatcher) {
  new Route('logout', {
    accessPolicy: 'private',

    enter: function() {
      Dispatcher.dispatch('session:logout');
    }
  });
});