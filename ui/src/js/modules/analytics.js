define(function(require) {
  var Pixy = require('pixy');
  var config = require('config');
  var singleton;
  var Analytics = Pixy.Object.extend({
    setAdapter: function(adapterFactory) {
      this.adapter = new adapterFactory(config);
    },

    login: function(id, name, firstName, lastName, email, plan) {
      if (!this.adapter) {
        console.warn('Analytics: rejecting request to login, no adapter is set.');
        return;
      }

      this.adapter.login({
        id: id,
        email: email,
        fullName: name,
        firstName: firstName,
        lastName: lastName,
        plan: plan || 'Lite'
      });
    },

    logout: function() {
      if (!this.adapter) {
        console.warn('Analytics: rejecting request to logout, no adapter is set.');
        return;
      }

      this.adapter.logout();
    },

    trackEvent: function(name, properties) {
      if (!this.adapter) {
        return;
      }

      this.adapter.trackEvent(name, properties);
    },

    trackPageView: function(url, title) {
      if (!this.adapter) {
        return;
      }

      this.adapter.trackPageView.apply(this.adapter, arguments);
    }
  });

  singleton = new Analytics();

  return singleton;
});