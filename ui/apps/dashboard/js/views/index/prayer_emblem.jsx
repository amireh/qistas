/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var classSet = React.addons.classSet;

  var Emblem = React.createClass({
    render: function() {
      var className = { 'PrayerScore': true };
      var normalizedScore = this.props.normalizedScore;

      if (this.props.score) {
        className['is-scored'] = true;
        normalizedScore = Math.round(normalizedScore * 100);

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
          {normalizedScore || 0}
        </span>
      );
    }
  });

  return Emblem;
});