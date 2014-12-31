/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Calendar = require('jsx!components/calendar');
  var Score = require('jsx!./index/score');
  var moment = require('moment');

  var ScoreChart = React.createClass({
    getDefaultProps: function() {
      return {
        monthPrayers: []
      };
    },

    render: function() {
      var props = this.props;
      var monthPrayers = this.props.monthPrayers;

      return(
        <div id="Scoreboard">
          <Calendar
            children={monthPrayers.map(this.renderPrayers)}
            date={moment().toJSON()} />
        </div>
      );
    },

    renderPrayers: function(dayPrayers) {

      return (
        <Score nrDays={7} prayers={dayPrayers} />
      );
    },

    _renderPrayers: function(dayPrayers) {
      return (
        <ul>
          {dayPrayers.map(function(prayer) {
            return <li key={'prayer-'+prayer.type}>{prayer.type}</li>;
          })}
        </ul>
      );
    }
  });

  return ScoreChart;
});