/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Calendar = require('jsx!components/calendar');
  var moment = require('moment');

  var ScoreChart = React.createClass({
    getDefaultProps: function() {
      return {
        prayers: []
      };
    },

    render: function() {
      var props = this.props;
      var startOfMonth = moment.utc().startOf('month');
      var endOfMonth = moment.utc().endOf('month');
      var monthPrayers = this.props.prayers.reduce(function(monthPrayers, prayer) {
        var date = moment.utc(prayer.date);
        var day = date.date();

        if (!date.isBefore(startOfMonth) && !date.isAfter(endOfMonth)) {
          if (!monthPrayers[day]) {
            monthPrayers[day] = [];
          }
          monthPrayers[day].push(prayer);
        }

        return monthPrayers;
      }, []);

      return(
        <div>
          <Calendar children={monthPrayers.map(this.renderPrayers)} />
        </div>
      );
    },

    renderPrayers: function(dayPrayers) {
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