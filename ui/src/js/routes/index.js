define([ 'routes/base', 'stores/sessions' ], function(Route, SessionStore) {
  new Route('index', {
    enter: function(transition) {
      setTimeout(function() {
        this.renderBasedOnAuthenticity();
      }.bind(this), 50);
    },

    renderBasedOnAuthenticity: function() {
      if (SessionStore.isActive()) {
        this.transitionTo('/dashboard');
      } else {
        this.transitionTo('/welcome');
      }
    }
  });
});