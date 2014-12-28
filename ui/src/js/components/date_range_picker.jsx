/** @jsx React.DOM */
define([
  'react',
  'pikaday',
  'moment',
  'i18n!components/date_range_picker',
  'actions/app',
  'config'
], function(React, Pikaday, moment, t, AppActions, Config) {
  var DEFAULT_FORMAT = Config.apiDateFormat;

  var DateRangePicker = React.createClass({
    getInitialState: function() {
      return {
        valid: true
      };
    },

    getDefaultProps: function() {
      return {
        useFormat: true,
        /**
         * @property {Boolean} [autoSave=true]
         * If true, the component will save the new date range using
         * AppActions.setDateRange().
         *
         * You can provide your own save handler by passing #onSave().
         */
        autoSave: true,

        futureQuickDates: false,
        pastQuickDates: true,

        format: DEFAULT_FORMAT,
        from: moment().startOf('month').format(DEFAULT_FORMAT),
        to: moment().endOf('month').format(DEFAULT_FORMAT)
      };
    },

    componentDidMount: function() {
      var validate = this.validate;
      var fmt = this.__getFormat();

      this.fromPicker = new Pikaday({
        field: this.refs.from.getDOMNode(),
        format: fmt,
        onSelect: validate,
        bound: false
      });

      this.toPicker = new Pikaday({
        field: this.refs.to.getDOMNode(),
        format: fmt,
        onSelect: validate,
        bound: false,
      });

      this.__syncFields(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
      this.__syncFields(nextProps);
    },

    componentWillUnmount: function() {
      this.fromPicker.destroy();
      this.toPicker.destroy();
    },

    render: function() {
      var futureJumps = this.props.futureQuickDates;
      var pastJumps = this.props.pastQuickDates;

      return(
        <div className="date-period-widget container-fluid">
          {
            !this.state.valid &&
            <div className="alert alert-warning">
              {t('errors.bad_date_period', "That's not a valid date period.")}
            </div>
          }

          <div className="row-fluid">
            <div className="span6">
              <input type="text" hidden ref="from" name="from" />
            </div>

            <div className="span6">
              <input type="text" hidden ref="to" name="to" />
            </div>
          </div>

          <div className="row-fluid bookmarks">
            <div className="span3">
              <button onClick={this.onToday}     className="btn btn-mini btn-link">
                {t('today', 'Today')}
              </button>

              {pastJumps &&
                <button onClick={this.onYesterday} className="btn btn-mini btn-link">
                  {t('yesterday', 'Yesterday')}
                </button>
              }

              {futureJumps &&
                <button onClick={this.onTomorrow} className="btn btn-mini btn-link">
                  {t('tomorrow', 'Tomorrow')}
                </button>
              }
            </div>

            <div className="span3">
              <button onClick={this.onThisWeek} className="btn btn-mini btn-link">
                {t('this_week', 'This Week')}
              </button>

              {pastJumps &&
                <button onClick={this.onLastWeek} className="btn btn-mini btn-link">
                  {t('last_week', 'Last Week')}
                </button>
              }

              {futureJumps &&
                <button onClick={this.onNextWeek} className="btn btn-mini btn-link">
                  {t('next_week', 'Next Week')}
                </button>
              }
            </div>

            <div className="span3">
              <button onClick={this.onThisMonth} className="btn btn-mini btn-link">
                {t('this_month', 'This Month')}
              </button>

              {pastJumps &&
                <button onClick={this.onLastMonth} className="btn btn-mini btn-link">
                  {t('last_month', 'Last Month')}
                </button>
              }

              {futureJumps &&
                <button onClick={this.onNextMonth} className="btn btn-mini btn-link">
                  {t('next_month', 'Next Month')}
                </button>
              }
            </div>

            <div className="span3">
              <button onClick={this.onThisYear} className="btn btn-mini btn-link">
                {t('this_year', 'This Year')}
              </button>

              {pastJumps &&
                <button onClick={this.onLastYear} className="btn btn-mini btn-link">
                  {t('last_year', 'Last Year')}
                </button>
              }

              {futureJumps &&
                <button onClick={this.onNextYear} className="btn btn-mini btn-link">
                  {t('next_year', 'Next Year')}
                </button>
              }
            </div>
          </div>

          <div className="row-fluid text-center">
            <button
              disabled={!this.state.valid}
              title={t('save', 'Save')}
              data-primary
              className="btn btn-success" onClick={this.onSave}>
              {t('accept', 'Accept')}
            </button>
          </div>
        </div>
      );
    },

    validate: function() {
      var from = this.fromPicker.getMoment();
      var to = this.toPicker.getMoment();
      var isValid = to.isSame(from) || to.isAfter(from);

      this.setState({ valid: isValid });

      return isValid;
    },

    onToday: function() {
      this.fromPicker.setMoment(moment().startOf('day'));
      this.toPicker.setMoment(moment().endOf('day'));
    },

    onTomorrow: function() {
      this.fromPicker.setMoment(moment().add('days', 1).startOf('day'));
      this.toPicker.setMoment(moment().add('days', 1).endOf('day'));
    },

    onYesterday: function() {
      this.fromPicker.setMoment(moment().subtract('days', 1).startOf('day'));
      this.toPicker.setMoment(moment().subtract('days', 1).endOf('day'));
    },

    onThisWeek: function() {
      this.fromPicker.setMoment(moment().startOf('week'));
      this.toPicker.setMoment(moment().endOf('week'));
    },

    onNextWeek: function() {
      this.fromPicker.setMoment(moment().add('weeks', 1).startOf('week'));
      this.toPicker.setMoment(moment().add('weeks', 1).endOf('week'));
    },

    onLastWeek: function() {
      this.fromPicker.setMoment(moment().startOf('week').subtract('weeks', 1));
      this.toPicker.setMoment(moment().subtract('weeks', 1).endOf('week'));
    },

    onThisMonth: function() {
      this.fromPicker.setMoment(moment().startOf('month'));
      this.toPicker.setMoment(moment().endOf('month'));
    },

    onNextMonth: function() {
      this.fromPicker.setMoment(moment().add('months', 1).startOf('month'));
      this.toPicker.setMoment(moment().add('months', 1).endOf('month'));
    },

    onLastMonth: function() {
      this.fromPicker.setMoment(moment().subtract('months', 1).startOf('month'));
      this.toPicker.setMoment(moment().subtract('months', 1).endOf('month'));
    },

    onThisYear: function() {
      this.fromPicker.setMoment(moment().startOf('year'));
      this.toPicker.setMoment(moment().endOf('year'));
    },

    onNextYear: function() {
      this.fromPicker.setMoment(moment().add('years', 1).startOf('year'));
      this.toPicker.setMoment(moment().add('years', 1).endOf('year'));
    },

    onLastYear: function() {
      this.fromPicker.setMoment(moment().subtract('years', 1).startOf('year'));
      this.toPicker.setMoment(moment().subtract('years', 1).endOf('year'));
    },

    onSave: function() {
      var fmt = this.__getFormat();
      var from = this.fromPicker.getMoment().format(fmt);
      var to = this.toPicker.getMoment().format(fmt);

      if (this.props.autoSave) {
        AppActions.setDateRange(from, to, fmt);
      }

      if (this.props.onSave) {
        this.props.onSave(from, to, fmt);
      }
    },

    __getFormat: function() {
      return this.props.useFormat ? this.props.format : undefined;
    },

    __syncFields: function(props) {
      var fmt = this.__getFormat();
      this.fromPicker.setMoment(moment(props.from, fmt));
      this.toPicker.setMoment(moment(props.to, fmt));
    },

  });

  return DateRangePicker;
});