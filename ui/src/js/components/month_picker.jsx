/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!month_picker');
  var SelectableMixin = require('mixins/selectable');

  var MONTHS = [
    { id: '1', abbr: 'jan', name: 'January' },
    { id: '2', abbr: 'feb', name: 'February' },
    { id: '3', abbr: 'mar', name: 'March' },
    { id: '4', abbr: 'apr', name: 'April' },
    { id: '5', abbr: 'may', name: 'May' },
    { id: '6', abbr: 'jun', name: 'June' },
    { id: '7', abbr: 'jul', name: 'July' },
    { id: '8', abbr: 'aug', name: 'August' },
    { id: '9', abbr: 'sep', name: 'September' },
    { id: '10', abbr: 'oct', name: 'October' },
    { id: '11', abbr: 'nov', name: 'November' },
    { id: '12', abbr: 'dec', name: 'December' },
  ];

  var MonthPicker = React.createClass({
    mixins: [ SelectableMixin ],

    propTypes: {
      valueLink: React.PropTypes.object.isRequired
    },

    getDefaultProps: function() {
      return {
        multiple: false
      };
    },

    render: function() {
      return(
        <div onChange={this.onChange} className="day-calendar months-of-year">
          {MONTHS.map(this.renderMonth)}
        </div>
      );
    },

    renderMonth: function(month) {
      var tagType = this.props.multiple ? 'checkbox' : 'radio';

      return (
        <label key={'month-'+month.id}>
          <input
            type={tagType} value={month.id}
            readOnly
            checked={this.isChecked(month.id)} />

          <span>
            {t('month', { context: month.abbr, defaultValue: month.name})}
          </span>
        </label>
      );
    }
  });

  return MonthPicker;
});