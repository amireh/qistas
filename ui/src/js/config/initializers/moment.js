define(function(require) {
  var moment = require('moment');
  var Pikaday = require('pikaday');
  var Config = require('config');
  var User = require('core/current_user');

  var setFormat = function(format) {
    moment.lang('en', {
      longDateFormat: {
        L: format,
        LL: Config.apiDateFormat
      },

      calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow]',
        lastWeek : '[Last] dddd',
        nextWeek : format,
        sameElse : format
      }
    });

    Pikaday.setup({ format: format });
  };

  // Update Moment.js and Pikaday anytime the user's dateFormat preference
  // changes:
  User.on('change:preferences.dateFormat', function() {
    var format = User.preference('dateFormat');

    if (!format || !format.length) {
      format = Config.defaultPreferences.user.dateFormat;
    }

    setFormat(format);
  });

  // Start with the default format in config.js:
  setFormat(Config.defaultPreferences.user.dateFormat);
});