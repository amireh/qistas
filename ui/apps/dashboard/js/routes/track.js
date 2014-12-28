define(function(require) {
  var Route = require('routes/secondary');
  var t = require('i18n!dashboard/tracker');
  var View = require('jsx!../views/tracker');
  var K = require('constants');
  var PrayerStore = require('../stores/prayers');

  return new Route('app:dashboard/track', {
    views: [
      { component: View, into: K.LAYOUT_DIALOGS }
    ],

    events: {
      finalizeQueryParamChange: function(query, out) {
        Object.keys(query).forEach(function(key) {
          out.push({ key: key, value: query[key] });
        });
      }
    },

    windowTitle: function() {
      return t('window_title', 'Track Prayer - Salati');
    },

    enter: function() {
      PrayerStore.addChangeListener(this.updateProps, this);
      this.updateProps();
    },

    updateProps: function() {
      this.update({
        prayers: PrayerStore.getAll()
      });
    }
  });
});