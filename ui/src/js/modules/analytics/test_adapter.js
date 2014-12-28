define([ './adapter' ], function(Adapter) {
  return Adapter.extend({
    STATE_UNKNOWN: 0,
    STATE_LOGGED_IN: 1,
    STATE_LOGGED_OUT: 2,

    initialize: function(config) {
      var adapterConfig = config.testAnalyticsAdapter || {};

      this.state = this.STATE_UNKNOWN;
      this.events = [];
      this.pageViews = [];

      if (adapterConfig.verbose) {
        this.verbose = true;
      }
    },

    log: function() {
      if (this.verbose) {
        console.log.apply(console, arguments);
      }
    },

    login: function(params) {
      this.identityParams = params;
      this.state = this.STATE_LOGGED_IN;

      this.trigger('change');
      this.log('[Analytics] logged in with identity:', params);
    },

    logout: function() {
      this.state = this.STATE_LOGGED_OUT;
      this.log('[Analytics] logged out.');
      this.trigger('change');
    },

    trackEvent: function(name, properties) {
      this.log('[Analytics] event:', name, '=>', JSON.stringify(properties));

      this.events.push({
        name: name,
        properties: properties
      });

      this.trigger('change');
    },

    trackPageView: function(url, title) {
      this.log('[Analytics] page view:', name, '=>', JSON.stringify(properties));

      this.pageViews.push({
        url: url,
        title: title
      });

      this.trigger('change');
    }
  });
});