/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var _ = require('lodash');
  var moment = require('moment');
  var Editor = require('jsx!./editor');
  var Popup = require('jsx!components/popup');
  var $ = require('jquery');

  var findWhere = _.findWhere;
  var classSet = React.addons.classSet;

  var Emblem = React.createClass({
    render: function() {
      var className = { 'PrayerScore': true };
      var normalizedScore = this.props.normalizedScore;

      if (this.props.score) {
        className['is-scored'] = true;
        normalizedScore = normalizedScore * 100;

        if (normalizedScore < 25) {
          className['score-poor'] = true;
        }
        else if (normalizedScore < 50) {
          className['score-good'] = true;
        }
        else if (normalizedScore < 75) {
          className['score-excellent'] = true;
        }
        else {
          className['score-perfect'] = true;
        }
      }
      else {
        className['is-missing'] = true;
      }

      return (
        <span className={classSet(className)}>
          {this.props.score || 0}
        </span>
      );
    }
  });

  var Index = React.createClass({
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

    componentDidUpdate: function(prevProps, prevState) {
      if (!this.state.editedCell) {
        this.hideEditor();
      }
      else if (
        this.state.editedPrayerType !== prevState.editedPrayerType ||
        this.state.editedPrayerDate !== prevState.editedPrayerDate
      ) {
        if (this.state.editedPrayerType && this.state.editedPrayerDate) {
          this.showEditor(
            this.state.editedPrayerType,
            this.state.editedPrayerDate,
            this.state.editedCell
          );
        }
      }
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

    renderEditor: function() {
      var state = this.state;
      var editedPrayer;
      var editorProps;

      if (this.state.editedPrayerType) {
        var day = moment(state.editedPrayerDate, K.API_DATE_FORMAT).date();
        var dayPrayers = this.props.monthPrayers[day-1];

        editedPrayer = dayPrayers.filter(function(prayer) {
          return (
            // prayer.normalizedDate === state.editedPrayerDate &&
            prayer.type === state.editedPrayerType
          );
        })[0];
      }

      return Popup({
        ref: "editorPopup",
        reactivePositioning: true,
        content: Editor,
        type: this.state.editedPrayerType,
        date: this.state.editedPrayerDate,
        children: <span hidden />,
        prayer: editedPrayer,
        onClose: this.stopEditing,
        onChange: this.repositionPopup
      });
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

    edit: function(prayerId, date, e) {
      e.preventDefault();

      if (this.state.editedCell === e.target) {
        this.stopEditing();
      }
      else {
        this.setState({
          editedPrayerType: prayerId,
          editedPrayerDate: date,
          editedCell: e.target
        });
      }
    },

    showEditor: function(prayerId, date, el) {
      var popup = this.refs.editorPopup;
      var api = popup.proxy('getApi');

      api.set('position.target', $(el));
      api.show();
      api.reposition();
    },

    stopEditing: function() {
      this.replaceState({});
    },

    hideEditor: function() {
      this.refs.editorPopup.close();
    },
    repositionPopup: function() {
      this.refs.editorPopup.reposition();
    }
  });

  return Index;
});