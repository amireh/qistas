define(function(require) {
  var Pixy = require('pixy');
  var moment = require('moment');
  var K = require('constants');
  var t = require('i18n!prayers');

  var PrayerModel = Pixy.Model.extend({
    parse: function(payload) {
      payload.normalized_date = moment.utc(payload.date).format(K.API_DATE_FORMAT);
      payload.readableType = this.labelFor(payload.type);

      return payload;
    },

    labelFor: function(type) {
      var readableType;

      switch (type) {
        case K.PRAYER_FAJR:
          readableType = t('fajr', 'Fajr');
        break;

        case K.PRAYER_DUHA:
          readableType = t('duha', 'Duha');
        break;

        case K.PRAYER_DHUHR:
          readableType = t('dhuhr', 'Dhuhr');
        break;

        case K.PRAYER_ASR:
          readableType = t('asr', 'Asr');
        break;

        case K.PRAYER_MAGHRIB:
          readableType = t('maghrib', 'Maghrib');
        break;

        case K.PRAYER_ISHAA:
          readableType = t('ishaa', "Isha'a");
        break;

        case K.PRAYER_WITR:
          readableType = t('witr', 'Witr');
        break;
      }

      return readableType;
    }
  });

  return PrayerModel;
});