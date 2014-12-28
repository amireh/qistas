/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var moment = require('moment');
  var K = require('constants');
  var t = require('i18n!calendar');
  var _ = require('underscore');

  var DAYS_OF_WEEK = K.DAYS_OF_WEEK;
  var range = _.range;
  var classSet = React.addons.classSet;

  var Calendar = React.createClass({
    getDefaultProps: function() {
      return {
        startingDay: 'sunday',
        date: moment().toJSON(),
        children: []
      };
    },

    render: function() {
      var today = moment();
      var thisMonth = moment(this.props.date);
      var anchor = DAYS_OF_WEEK.indexOf(this.props.startingDay);
      var days = DAYS_OF_WEEK.slice(anchor).concat(DAYS_OF_WEEK.slice(0, anchor));
      var dayCount = thisMonth.daysInMonth();
      var firstDayOfMonth = thisMonth.clone().startOf('month').day();
      var dayOffset = firstDayOfMonth;
      var nrRows = Math.ceil((dayCount + firstDayOfMonth) / 7.0);
      var context = {
        cursor: 0,
        anchor: thisMonth.clone(),
        dayOffset: dayOffset,
        dayCount: dayCount - 1,
        today: today
      };

      return(
        <div className="calendar">
          {this.renderHeader(thisMonth)}
          <table className="pika-table">
            <thead>
              <tr>{days.map(this.renderDayColumn)}</tr>
            </thead>
            <tbody>
              {range(0,nrRows).map(this.renderDayRow.bind(null, context))}
            </tbody>
          </table>
        </div>
      );
    },

    renderHeader: function(date) {
      return (
        <header className="pika-title">
          <div className="pika-label">
            {date.format('MMMM YYYY')}
          </div>

          <nav className="navigation">
            <button
              className="btn-a11y prev-btn pika-prev"
              title={t('tooltips.prev_month', 'Previous month')}
              children={<i className="icon-arrow-left" />}
              onClick={this.onPrev} />

            <button
              className="btn-a11y next-btn pika-next"
              title={t('tooltips.next_month', 'Next month')}
              children={<i className="icon-arrow-right" />}
              onClick={this.onNext} />
          </nav>
        </header>
      );
    },

    renderDayColumn: function(day) {
      return (
        <th key={'column-' + day}>
          {t('day_abbr', {
            context: day,
            defaultValue: day.capitalize().split('').slice(0,3).join('')
          })}
        </th>
      );
    },

    renderDayRow: function(context, day) {
      return (
        <tr key={'row-'+day}>{range(0,7).map(this.renderDayCell.bind(null, context))}</tr>
      );
    },

    renderDayCell: function(context) {
      var className = {};
      var cursor = context.cursor++;
      var isEmpty =
        cursor < context.dayOffset ||
        cursor > (context.dayCount + context.dayOffset);

      if (isEmpty) {
        return (<td key={"cell-"+context.cursor} className="is-empty" />);
      }

      var day = cursor - context.dayOffset + 1;
      var isInactive = context.today.isAfter(context.anchor.clone().date(day));
      var isToday = context.today.date() === day;

      className['inactive'] = isInactive;
      className['is-today'] = isToday;

      return (
        <td key={'cell-'+context.cursor} className={classSet(className)}>
          <span className="day-index pika-button" children={day} />
          <div className="day-content">
            {this.props.children[day]}
          </div>
        </td>
      );
    },

    onPrev: function() {
      if (this.props.onChange) {
        this.props.onChange(moment(this.props.date).subtract('month', 1));
      }
    },

    onNext: function() {
      if (this.props.onChange) {
        this.props.onChange(moment(this.props.date).add('month', 1));
      }
    }
  });

  return Calendar;
});