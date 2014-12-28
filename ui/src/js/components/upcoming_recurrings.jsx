/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var Controls = require('jsx!./upcoming_recurrings/controls');
  var Balance = require('jsx!components/balance');
  var t = require('i18n!dashboard/upcoming_recurrings');
  var moment = require('moment');
  var BalanceCalculator = require('models/balance_calculator');

  var UpcomingRecurrings = React.createClass({
    mixins: [ React.addons.LinkedStateMixin ],

    getDefaultProps: function() {
      return {
        recurrings: [],
        meta: {},
        defaultCurrency: 'USD'
      };
    },

    render: function() {
      var recurrings = this.props.recurrings.filter(function(recurring) {
        return !recurring.isNew;
      });

      return(
        <div className="upcoming-recurrings">
          <h3>
            {t('header', 'Upcoming Recurrings')}

            <Controls
              from={this.props.meta.from}
              to={this.props.meta.to} />
          </h3>

          {recurrings.length === 0 ?
            <p key="empty-note" className="widget-summary">{t('empty_note', 'There are no recurrings due soon.')}</p> :
            [
              <p key="summary" className="widget-summary">
                {t('summary',
                  'There are __count__ recurrings due within the selected period.', {
                  count: recurrings.length
                })}
              </p>,

              this.renderTable(recurrings)
            ]
          }
        </div>
      );
    },

    renderTable: function(recurrings) {
      var defaultCurrency = this.props.defaultCurrency;
      var total = BalanceCalculator.balanceForSet(recurrings, defaultCurrency, true);

      return (
        <table key="listing" className="listing table">
          <thead>
            <tr>
              <th>{t('table.headers.name', 'Name')}</th>
              <th>{t('table.headers.due', 'Due')}</th>
              <th>{t('table.headers.amount', 'Amount')}</th>
            </tr>
          </thead>
          <tbody>
            {recurrings.map(this.renderRecurring)}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan="2">{t('table.headers.total', 'Total')}</td>
              <td>
                <Balance
                  amount={total}
                  currency={this.props.defaultCurrency} />
              </td>
            </tr>
          </tfoot>
        </table>
      );
    },

    renderRecurring: function(recurring) {
      return (
        <tr key={'recurring'+recurring.id}>
          <td>{recurring.name}</td>

          <td>{moment(recurring.nextBillingDate).fromNow()}</td>
          <td>
            <Balance
              amount={recurring.amount}
              sign={recurring.coefficient === -1 ? '-' : '+'}
              currency={recurring.currency} />
          </td>
        </tr>
      );
    }
  });

  return UpcomingRecurrings;
});