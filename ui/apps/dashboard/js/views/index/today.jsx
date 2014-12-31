/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var t = require('i18n!dashboard');
  var Emblem = require('jsx!./prayer_emblem');
  var Score = require('jsx!./score');
  var PrayerEditorMixin = require('jsx!../../mixins/prayer_editor');
  var PrayerModel = require('../../models/prayer');
  var classSet = React.addons.classSet;

  var Today = React.createClass({
    mixins: [ PrayerEditorMixin ],

    getDefaultProps: function() {
      return {
        prayers: []
      };
    },

    render: function() {
      var lastPrayer = this.props.prayers[this.props.prayers.length-1];
      var nextPrayerType;

      if (lastPrayer) {
        nextPrayerType = K.PRAYER_TIMELINE[
          K.PRAYER_TIMELINE.indexOf(lastPrayer.type) + 1
        ];
      }
      else {
        nextPrayerType = K.PRAYER_TIMELINE[0];
      }

      return(
        <div className="TodayPrayers">
          <h2>
            {t('today', 'Today')}

            {' '}

            <Score prayers={this.props.prayers} nrDays={1} />
          </h2>

          {this.renderEditor()}

          {this.renderPrayerCell(K.PRAYER_FAJR, nextPrayerType)}
          {this.renderPrayerCell(K.PRAYER_DUHA, nextPrayerType)}
          {this.renderPrayerCell(K.PRAYER_DHUHR, nextPrayerType)}
          {this.renderPrayerCell(K.PRAYER_ASR, nextPrayerType)}
          {this.renderPrayerCell(K.PRAYER_MAGHRIB, nextPrayerType)}
          {this.renderPrayerCell(K.PRAYER_ISHAA, nextPrayerType)}
          {this.renderPrayerCell(K.PRAYER_WITR, nextPrayerType)}
        </div>
      );
    },

    renderPrayerCell: function(type, nextPrayerType) {
      var record = this.getPrayer(type);
      var className = {
        'TodayPrayers__Prayer': true,
        'is-upcoming': nextPrayerType === type
      };

      return (
        <div
          className={classSet(className)}
          onClick={this.edit.bind(null, type, this.props.date)}
          onKeyUp={this.editOnReturn.bind(null, type, this.props.date)}
          key={"prayer-"+type}>
          {Emblem(record)}
          {PrayerModel.prototype.labelFor(type)}
        </div>
      )
    },

    getPrayer: function(type, date) {
      return this.props.prayers.filter(function(prayer) {
        return prayer.type === type;
      })[0];
    }
  });

  return Today;
});