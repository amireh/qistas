define(function(require) {
  var config = require('config');
  var Analytics = require('modules/analytics');
  var TestAdapter = require('modules/analytics/test_adapter');
  var MixpanelAdapter = require('modules/analytics/mixpanel_adapter');

  if (config.analyticsAdapter === 'mixpanel') {
    Analytics.setAdapter(MixpanelAdapter);
  }
  else {
    Analytics.setAdapter(TestAdapter);
  }
});