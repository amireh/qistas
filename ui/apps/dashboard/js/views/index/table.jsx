/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var _ = require('lodash');
  var t = require('i18n!dashboard');
  var moment = require('moment');
  var PrayerEditorMixin = require('jsx!../../mixins/prayer_editor');
  var Emblem = require('jsx!./prayer_emblem');

  var findWhere = _.findWhere;

  var PrayerTable = React.createClass({
    mixins: [ PrayerEditorMixin ],

    getDefaultProps: function() {
      var today = moment();

      return {
        prayers: [],
        month: today.month(),
        year: today.year()
      };
    },

    render: function() {
      return(
        <table className="PrayerTable table">
          {this.renderEditor()}

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
            {this.props.prayers.concat([]).reverse().map(this.renderContentRow)}
          </tbody>
        </table>
      );
    },

    renderContentRow: function(dayPrayers, dayIndex) {
      var day = this.props.prayers.length - dayIndex;
      var date = moment([
        this.props.year,
        this.props.month,
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
      var dayPrayers = this.props.prayers[day-1];

      return dayPrayers.filter(function(prayer) {
        return prayer.type === type;
      })[0];
    }
  });

  return PrayerTable;
});