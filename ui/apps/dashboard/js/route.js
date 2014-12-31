define(function(require) {
  var Route = require('routes/base');
  var t = require('i18n!dashboard/index');
  var View = require('jsx!./views/index');
  var K = require('constants');
  var moment = require('moment');
  var PrayerStore = require('./stores/prayers');
  var User = require('core/current_user');

  return new Route('app:dashboard', {
    views: [
      { component: View }
    ],

    accessPolicy: K.ACCESS_POLICY_PRIVATE,

    windowTitle: function() {
      return t('window_title', 'Dashboard - Pibi');
    },

    beforeModel: function(transition) {
    },

    model: function() {
      return PrayerStore.load();
    },

    enter: function() {
      PrayerStore.addChangeListener(this.updateProps, this);
      this.updateProps();
    },

    updateProps: function() {
      var today = moment();
      var thisMonthPrayers = PrayerStore.getPrayersInMonth(today.year(), today.month());

      this.update({
        monthPrayers: thisMonthPrayers,
        todayPrayers: thisMonthPrayers[today.date()-1],
        prayers: PrayerStore.getAll(),

        meta: {
          year: today.year(),
          month: today.month(),
          daysInMonth: today.daysInMonth(),
          maxDailyPrayerScore: User.get('max_daily_prayer_score')
        }
      });
    }
  });
});