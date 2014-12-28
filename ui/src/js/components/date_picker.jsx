/** @jsx React.DOM */
define([
  'ext/react',
  'pikaday',
  'moment',
  'i18n!components/date_picker'
], function(React, Pikaday, moment, t) {
  // var DEFAULT_FORMAT = 'MM/DD/YYYY';
  var LinkUtils = React.LinkUtils;
  var toMoment = function(date/*, format*/) {
    return moment.utc(date);
  };

  var synchronize = function() {
    this.picker.setMoment(toMoment(LinkUtils.getValue(this.props),
      this.props.format), true);
  };

  var DatePicker = React.createClass({
    getDefaultProps: function() {
      return {
        format: undefined
      };
    },

    componentDidMount: function() {
      this.picker = new Pikaday({
        field: this.refs.date.getDOMNode(),
        format: this.props.format,
        bound: false,
        onSelect: function() {
          var selected = this.picker.getMoment();
          var normalized = moment.utc();

          normalized.year(selected.year());
          normalized.month(selected.month());
          normalized.date(selected.date());

          LinkUtils.onChange(this.props, normalized.toJSON());

          synchronize.call(this);
        }.bind(this)
      });
    },

    componentDidUpdate: function() {
      synchronize.call(this);
    },

    componentWillUnmount: function() {
      this.picker.destroy();
    },

    render: function() {
      return(
        <div className="date-picker">
          <input
            type="text"
            ref="date"
            name="date"
            valueLink={this.props.valueLink}
            hidden />

          <div className="actions">
            <button onClick={this.onToday} className="btn btn-default">
              {t('today', 'Today')}
            </button>

            <button onClick={this.onYesterday} className="btn btn-default">
              {t('yesterday', 'Yesterday')}
            </button>

            <button
              data-primary
              className="btn btn-success pull-right" onClick={this.props.onClose}>
              {t('accept', 'Accept')}
            </button>
          </div>
        </div>
      );
    },

    onToday: function() {
      this.picker.setMoment(toMoment());
    },

    onYesterday: function() {
      this.picker.setMoment(toMoment().subtract('days', 1));
    }
  });

  return DatePicker;
});