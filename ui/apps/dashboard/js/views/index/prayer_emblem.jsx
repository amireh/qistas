/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var classSet = React.addons.classSet;

  var Emblem = React.createClass({
    render: function() {
      var className = { 'PrayerScore': true };
      var normalizedScore = this.props.normalizedScore;
      var scoreLetter;

      if (this.props.score) {
        className['is-scored'] = true;
        normalizedScore = Math.round(normalizedScore * 100);

        if (normalizedScore < 25) {
          className['score-poor'] = true;
          scoreLetter = 'D';
        }
        else if (normalizedScore < 50) {
          className['score-fair'] = true;
          scoreLetter = 'C';
        }
        else if (normalizedScore < 75) {
          className['score-good'] = true;
          scoreLetter = 'B';
        }
        else if (normalizedScore < 100) {
          scoreLetter = 'A';
          className['score-excellent'] = true;
        }
        else {
          scoreLetter = <span>A<sup>*</sup></span>;
          className['score-perfect'] = true;
        }
      }
      else {
        className['is-missing'] = true;
        scoreLetter = 'F';
      }

      return (
        <span tabIndex="0" className={classSet(className)}>
          {scoreLetter}
        </span>
      );
    }
  });

  return Emblem;
});