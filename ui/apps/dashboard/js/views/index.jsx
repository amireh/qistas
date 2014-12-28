/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var _ = require('lodash');
  var moment = require('moment');
  var PrayerEditorMixin = require('jsx!../mixins/prayer_editor');
  var Emblem = require('jsx!./index/prayer_emblem');

  var findWhere = _.findWhere;

  var Index = React.createClass({
    mixins: [ PrayerEditorMixin ],

    getDefaultProps: function() {
      return {
        monthPrayers: [],
        meta: {}
      };
    },

    getInitialState: function() {
      return {
      };
    },

    render: function() {
      var props = this.props;

      return(
        <div>
          {this.renderEditor()}

          <table className="table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Fajr</th>
                <th>Duha</th>
                <th>Dhuhr</th>
                <th>Asr</th>
                <th>Maghrib</th>
                <th>Isha'a</th>
                <th>Witr</th>
              </tr>
            </thead>

            <tbody>
              {this.props.monthPrayers.concat([]).reverse().map(this.renderContentRow)}
            </tbody>
          </table>
        </div>
      );
    },

    renderContentRow: function(dayPrayers, dayIndex) {
      var day = this.props.monthPrayers.length - dayIndex;
      var date = moment([
        this.props.meta.year,
        this.props.meta.month,
        day
      ]).format(K.API_DATE_FORMAT);

      return (
        <tr key={'day-prayers-'+day}>
          <td key="day">Day {day}</td>

          {this.renderPrayerCell(K.PRAYER_FAJR, dayPrayers, date)}
          {this.renderPrayerCell(K.PRAYER_DUHA, dayPrayers, date)}
          {this.renderPrayerCell(K.PRAYER_DHUHR, dayPrayers, date)}
          {this.renderPrayerCell(K.PRAYER_ASR, dayPrayers, date)}
          {this.renderPrayerCell(K.PRAYER_MAGHRIB, dayPrayers, date)}
          {this.renderPrayerCell(K.PRAYER_ISHAA, dayPrayers, date)}
          {this.renderPrayerCell(K.PRAYER_WITR, dayPrayers, date)}
        </tr>
      );
    },

    renderPrayerCell: function(prayerId, set, date) {
      var record = findWhere(set, { type: prayerId });
      var key = 'prayer-'+prayerId;
      var href = '/dashboard/track?type=' + prayerId + '&date=' + date;

      return (
        <td key={key}>
          <a onClick={this.edit.bind(null, prayerId, date)}>
            {Emblem(record)}
          </a>
        </td>
      );
    },

    getPrayer: function(type, date) {
      var day = moment(date, K.API_DATE_FORMAT).date();
      var dayPrayers = this.props.monthPrayers[day-1];

      return dayPrayers.filter(function(prayer) {
        return prayer.type === type;
      })[0];
    }
  });

  return Index;
});