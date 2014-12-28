/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Balance = require('jsx!components/balance');
  var moment = require('moment');
  var config = require('config');
  var t = require('i18n!components/transaction_listing');
  var API_DATE_FORMAT = config.apiDateFormat;

  var Header = React.createClass({
    getDefaultProps: function() {
      return {
        drilldownMode: 'months',
        from: undefined,
        to: undefined,
        format: undefined,
        label: undefined
      };
    },

    generateLabel: function(from, to, drilldownMode) {
      /*jshint -W027*/
      switch(drilldownMode) {
        case 'today':
        case 'yesterday':
          return from.calendar();
        break;

        case 'single_month':
          return from.format('MMMM, YYYY');
        break;

        case 'days':
          return [
            from.format('[From] DD-MM-YYYY'),
            to.format('[to] DD-MM-YYYY')
          ].join(' ');
        break;

        default:
          return [
            from.format('[From] DD[/]MM[/]YYYY'),
            to.format('[to] DD[/]MM[/]YYYY')
          ].join(' ');
      }
    },

    render: function() {
      return(
        <h3>
          <span className="tx-listing-date-range">
            {this.props.label || this.generateLabel(
              moment(this.props.from, API_DATE_FORMAT),
              moment(this.props.to, API_DATE_FORMAT),
              this.props.drilldownMode)}
          </span>

          <Balance
            amount={this.props.balance}
            upcomingAmount={this.props.upcomingBalance}
            currency={this.props.currency}
            className="pull-right" />
        </h3>
      );
    }
  });

  return Header;
});