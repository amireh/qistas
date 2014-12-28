define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');

  var PrivacyPolicy = Pixy.Model.extend({
    defaults: {
      trackable: true,
      metric_blacklist: []
    },

    outboundAttrs: K.PRIVACY_POLICY_OUTBOUND_ATTRS,

    url: function() {
      return this.get('href') || '/users/self/privacy_policy';
    },

    isMetricAllowed: function(metric) {
      if (!this.get('trackable')) {
        return false;
      }

      var disallowedMetrics = this.get('metric_blacklist') || [];

      return disallowedMetrics.indexOf(metric) === -1;
    },

    fromProps: function(props) {
      var whitelist = this.outboundAttrs;
      var attrs = convertCase.underscore(props);

      if (whitelist) {
        attrs = pick(attrs, whitelist);
      }

      return attrs;
    }
  });

  return PrivacyPolicy;
})