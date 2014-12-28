/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var t = require('i18n!recurrence_picker');
  var DaysOfWeek = require('jsx!components/days_of_week');
  var DaysOfMonth = require('jsx!components/days_of_month');
  var MonthPicker = require('jsx!components/month_picker');
  var Select = require('jsx!components/chosen');
  var stockLinkState = React.addons.LinkedStateMixin.linkState;

  var RecurrencePicker = React.createClass({
    propTypes: {
      linkState: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
      return {
      };
    },

    getDefaultProps: function() {
      return {
        linkState: null
      };
    },

    render: function() {
      var options = this.renderOptions();
      var hasOptions = !!options;
      var columnClassName = hasOptions ? 'span6' : 'span12';
      var linkState = this.props.linkState || stockLinkState.bind(this);

      return(
        <div className="recurrence-picker row-fluid">
          <div className={columnClassName}>
            <label className="form-label">
              {t('labels.frequency', 'Frequency')}

              <div className="margined">
                <Select width="100%" valueLink={linkState('frequency')} withArrow>
                  <option value="daily">{t('daily', 'Daily')}</option>
                  <option value="weekly">{t('weekly', 'Weekly')}</option>
                  <option value="monthly">{t('monthly', 'Monthly')}</option>
                  <option value="yearly">{t('yearly', 'Yearly')}</option>
                </Select>
              </div>
            </label>

            <div>
              <label className="form-label">
                {t('labels.every', 'Every')}

                <div className="margined">
                  <input
                    className="form-input input-block"
                    type="number"
                    min="1"
                    valueLink={linkState('every')}
                    placeholder="1" />
                </div>
              </label>
            </div>
          </div>

          {hasOptions && <div className="span6">{options}</div>}
        </div>
      );
    },

    renderOptions: function() {
      var linkState = this.props.linkState || stockLinkState.bind(this);

      switch(this.getFrequency()) {
        case 'daily':
          return false;
        break;

        case 'weekly':
          return WeeklyOptions({
            valueLink: linkState('weeklyDays')
          });
        break;

        case 'monthly':
          return MonthlyOptions({
            valueLink: linkState('monthlyDays')
          });
        break;

        case 'yearly':
          return YearlyOptions({
            yearlyMonths: linkState('yearlyMonths'),
            yearlyDay: linkState('yearlyDay')
          });
        break;
      }
    },

    getFrequency: function() {
      var linkState = this.props.linkState || stockLinkState.bind(this);

      return linkState('frequency').value;
    }
  });

  var WeeklyOptions = React.createClass({
    render: function() {
      return(
        <div>
          <header className="form-label">
            {t('days_of_week', 'Weekdays')}
          </header>

          <DaysOfWeek valueLink={this.props.valueLink} multiple />
        </div>
      );
    }
  });

  var MonthlyOptions = React.createClass({
    getDefaultProps: function() {
      return {
        multiple: true
      };
    },
    render: function() {
      return(
        <div>
          <header className="form-label">
            {t('day_of_month', {
              context: this.props.multiple ? 'multiple' : 'single',
              defaultValue: this.props.multiple ? 'Day(s) of Month' : 'Day of Month'
            })}
          </header>

          <DaysOfMonth valueLink={this.props.valueLink} multiple={this.props.multiple} />
        </div>
      );
    }
  });

  var YearlyOptions = React.createClass({
    render: function() {
      return(
        <div>
          <header className="form-label">
            {t('months_of_year', {
              context: 'multiple',
              defaultValue: 'Select month(s)'
            })}
          </header>

          <MonthPicker
            valueLink={this.props.yearlyMonths}
            multiple />

          <MonthlyOptions
            multiple={false}
            valueLink={this.props.yearlyDay} />
        </div>
      );
    }
  });

  return RecurrencePicker;
});