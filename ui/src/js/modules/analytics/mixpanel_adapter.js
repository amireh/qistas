/* global mixpanel: true */
define([ './adapter', 'mixpanel' ], function(Adapter, __mixpanel__) {

  /**
   * @class Pibi.Util.Analytics.Adapter.Mixpanel
   * @extends Pibi.Util.Analytics.Adapter
   *
   * An analytics adapter for [Mixpanel](https://mixpanel.com).
   */
  return Adapter.extend({
    name: 'Mixpanel',

    initialize: function(appConfig) {
      var options = {};
      var config = appConfig.mixpanel || {};

      if (!config.token || !config.namespace) {
        console.error('MixpanelAdapter: missing token and namespace configs.');
      }

      //>>excludeStart("production", pragmas.production);
      options.debug = !!config.debug;
      //>>excludeEnd("production");

      mixpanel.init(config.token, options, config.namespace);

      this.tracker = mixpanel[config.namespace];
    },

    login: function(params) {
      this.tracker.identify(params.id);
      this.tracker.name_tag(params.fullName);

      this.tracker.people.set_once('First Seen', new Date());
      this.tracker.people.set({
        '$first_name': params.firstName,
        '$last_name': params.lastName,
        '$email': params.email,
        'Plan': params.plan
      });

      this.tracker.people.increment('Logins');
    },

    logout: function() {},

    trackEvent: function(name, properties) {
      this.tracker.track(name, properties);
    },

    trackPageView: function(url) {
      this.tracker.track_pageview(url);
    }
  });

});