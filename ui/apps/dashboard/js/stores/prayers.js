define(function(require) {
  var Pixy = require('pixy');
  var moment = require('moment');
  var K = require('constants');
  var _ = require('lodash');
  var convertCase = require('util/convert_case');
  var pick = _.pick;
  var range = _.range;
  var where = _.where;

  var PrayerModel = Pixy.Model.extend({
    parse: function(payload) {
      payload.normalized_date = moment.utc(payload.date).format(K.API_DATE_FORMAT);

      return payload;
    }
  });

  var PrayerCollection = Pixy.Collection.extend({
    model: PrayerModel,
    url: '/prayers',

    findByDate: function(date, query) {
      if (!query) {
        query = {};
      }

      query.normalized_date = moment.utc(date).format(K.API_DATE_FORMAT);

      return this.findWhere(query);
    },

    comparator: function(model) {
      return K.PRAYER_TIMELINE.indexOf(model.get('type'));
    }
  });

  return new Pixy.Store('prayers', {
    getInitialState: function() {
      return {
        prayers: new PrayerCollection()
      };
    },

    getAll: function() {
      return this.state.prayers.toProps();
    },

    load: function() {
      return this.state.prayers.fetchAll({ reset: true });
    },

    getPrayersInMonth: function(year, month) {
      var date = moment([ year, month ]).startOf('month');
      var today = moment();
      var thisMonth = moment().startOf('month');
      var collection = this.state.prayers.toProps();
      var endDay;

      if (date.isSame(thisMonth)) {
        endDay = today.date();
      }
      else {
        endDay = date.daysInMonth();
      }

      return range(0, endDay, 1).map(function(day) {
        var dayPrayers;

        dayPrayers = where(collection, {
          normalizedDate: date.format(K.API_DATE_FORMAT)
        });

        date.add(1, 'days');

        return dayPrayers;
      });
    },

    actions: {
      save: function(payload, onChange, onError) {
        var collection = this.state.prayers;
        var type = payload.type.toLowerCase();
        var model = collection.findByDate(payload.date, { type: type });
        var attrs = pick(convertCase.underscore(payload), K.PRAYER_OUTBOUND_ATTRS);

        if (!model) {
          model = collection.push({
            id: K.NEW_MODEL_ID,
            date: payload.date,
            type: type
          }, { parse: true });
        }

        attrs.type = type;

        model.save(attrs, {
          wait: true,
          validate: false,
          parse: true,
          patch: !model.isNew()
        }).then(function() {
          collection.sort();
          onChange();
        }, onError);
      }
    }
  });
});