/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var SelectableMixin = require('mixins/selectable');
  var _ = require('underscore');
  var range = _.range;

  var DaysOfMonth = React.createClass({
    mixins: [ SelectableMixin ],

    getDefaultProps: function() {
      return {
        dayRange: [1,31],
        multiple: true,
      };
    },

    render: function() {
      var dayRange = this.props.dayRange;

      return(
        <div onChange={this.onChange} className="day-calendar days-of-month">
          {range(dayRange[0], dayRange[1]+1).map(this.renderDay)}
        </div>
      );
    },

    renderDay: function(dayIndex) {
      var tagType = this.props.multiple ? 'checkbox' : 'radio';
      var day = ''+dayIndex;

      return (
        <label key={'day-'+day}>
          <input type={tagType} value={day} readOnly checked={this.isChecked(day)} />
          <span children={day} />
        </label>
      );
    }
  });

  return DaysOfMonth;
});