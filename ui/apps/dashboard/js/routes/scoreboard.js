define(function(require) {
  var Route = require('routes/base');
  var t = require('i18n!dashboard/scoreboard');
  var View = require('jsx!../views/scoreboard');
  var K = require('constants');
  var PrayerStore = require('../stores/prayers');

  return new Route('app:dashboard/scoreboard', {
    views: [{ component: View }],

    windowTitle: function() {
      return t('window_title', 'Scoreboard - Salati');
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