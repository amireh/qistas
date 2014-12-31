/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var _ = require('lodash');
  var moment = require('moment');
  var Today = require('jsx!./index/today');
  var PrayerTable = require('jsx!./index/table');
  var ScoreGraph = require('jsx!./index/score_graph');
  var Score = require('jsx!./index/score');
  var t = require('i18n!dashboard');

  var Index = React.createClass({
    getDefaultProps: function() {
      return {
        prayers: [],
        monthPrayers: [],
        meta: {
          daysInMonth: 1
        },
        user: {}
      };
    },

    getInitialState: function() {
      return {
      };
    },

    render: function() {
      var props = this.props;
      var meta = props.meta;

      return(
        <div>
          <Today
            prayers={this.props.todayPrayers}
            date={moment().format(K.API_DATE_FORMAT)} />

          <h2>
            {t('headers.this_month', 'This Month')}
            {' '}

            <Score
              prayers={props.prayers}
              nrDays={meta.daysInMonth} />
          </h2>

          <ScoreGraph
            prayers={this.props.prayers}
            maxScore={meta.maxDailyPrayerScore} />

          <PrayerTable
            prayers={this.props.monthPrayers}
            year={meta.year}
            month={meta.month} />
        </div>
      );
    },
  });

  return Index;
});