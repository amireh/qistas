define(function(require) {
  var Pixy = require('ext/pixy');
  var Config = require('config');
  var user = require('core/current_user');
  var ajax = require('core/ajax');
  var analytics = require('actions/analytics');
  var t = require('i18n!analytics');
  var UserStore = require('stores/users');

  var privacyPolicy = user.privacyPolicy;
  var store;

  store = new Pixy.Store('analytics', {
    _key: 'analytics',

    toProps: function() {
      var props = privacyPolicy.toProps();

      props.metrics = analytics.getMetrics().map(function(metric) {
        var i18nKey = metric.id.replace(/([A-Z]{2,})/, function(str) {
          return str.camelize();
        }).underscore();

        metric.label = t('metrics.' + i18nKey + '.label', metric.name);
        metric.description = t('metrics.' + i18nKey + '.description', ' ').trim();

        return metric;
      });

      return props;
    },

    actions: {
      blacklistMetric: function(params, onChange, onError) {
        var metric = params.name;
        var isAllowed = params.allowed;
        var blacklist = privacyPolicy.get('metric_blacklist');
        var index = blacklist.indexOf(metric);

        if (isAllowed && index > -1) {
          blacklist.splice(index, 1);
        }
        else if (!isAllowed && index === -1) {
          blacklist.push(metric);
        }

        privacyPolicy.save({
          metric_blacklist: blacklist
        }, { wait: true, patch: true }).then(onChange, onError);
      },
    }
  });

  UserStore.on('change', function() {
    store.emitChange();
  });

  return store;
});