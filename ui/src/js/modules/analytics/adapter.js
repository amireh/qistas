define([ 'pixy' ], function(Pixy) {
  /**
   * @class Analytics.Adapter
   * @abstract
   * @inheritable
   *
   * A module for representing an analytics back-end for use by the
   * {@link Analytics Analytics module}.
   */
  return Pixy.Object.extend({
    initialize: function(config) {},

    login: function() {
      throw new Error("Analytics.Adapter: missing implementation #connect");
    },

    logout: function() {
      throw new Error("Analytics.Adapter: missing implementation #disconnect");
    },

    trackEvent: function(category, action, str_value, int_value) {
      throw new Error("Analytics.Adapter: missing implementation #trackEvent");
    },

    trackPageView: function(url, title) {
      throw new Error("Analytics.Adapter: missing implementation #trackPageView");
    }
  });
});