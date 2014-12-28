/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var SelectableMixin = require('mixins/selectable');
  var t = require('i18n!days_of_week');
  var K = require('constants');

  var DAYS_OF_WEEK = K.DAYS_OF_WEEK;

  var DaysOfWeek = React.createClass({
    mixins: [ SelectableMixin ],

    getDefaultProps: function() {
      return {
        startingDay: 'sunday',
        multiple: true,
      };
    },

    render: function() {
      var anchor = DAYS_OF_WEEK.indexOf(this.props.startingDay);
      var sortedDaysOfWeek = DAYS_OF_WEEK.slice(anchor).concat(DAYS_OF_WEEK.slice(0, anchor));

      return(
        <div onChange={this.onChange} className="day-calendar days-of-week">
          {sortedDaysOfWeek.map(this.renderDay)}
        </div>
      );
    },

    renderDay: function(dayIndex) {
      var tagType = this.props.multiple ? 'checkbox' : 'radio';
      var day = ''+dayIndex;

      return (
        <label key={'day-'+day}>
          <input type={tagType} value={day} readOnly checked={this.isChecked(day)} />
          <span children={t('day', { context: day, defaultValue: day.capitalize() })} />
        </label>
      );
    }
  });

  return DaysOfWeek;
});