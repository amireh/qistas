define([
  'routes/base',
  'jsx!../../views/oauth/failure',
  'i18n!oauth/failure'
], function(Route, View, t) {
  new Route('oauthFailure', {
    windowTitle: function() {
      return t('window_title', 'Authentication Failed - Pibi');
    },

    enter: function(transition) {
      var provider = transition.params.oauthFailure.provider;
      var message = transition.queryParams.message;

      this.mount(View, {
        into: 'main'
      });

      this.update({
        provider: provider,
        message: message
      });
    },

    exit: function() {
      this.unmount(View);
    }
  });
});