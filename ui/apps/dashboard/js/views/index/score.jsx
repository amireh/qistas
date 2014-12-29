/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var User = require('core/current_user');

  var Score = React.createClass({
    getDefaultProps: function() {
      return {
        nrDays: 1,
        prayers: []
      };
    },

    render: function() {
      var maxScore = User.get('max_daily_prayer_score');
      var score = this.props.prayers.reduce(function(tally, prayer) {
        return tally + prayer.score;
      }, 0);

      score /= Math.max(1, maxScore * this.props.nrDays);
      score *= 100;

      return(
        <span className="PrayerPeriodScore">
          ({score.toFixed(2)}%)
        </span>
      );
    }
  });

  return Score;
});