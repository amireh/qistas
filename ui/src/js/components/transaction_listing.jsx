/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var _ = require('underscore');
  var K = require('constants');
  var t = require('i18n!components/transaction_listing');
  var TimePartitioner = require('models/time_partitioner');
  var Header = require('jsx!./transaction_listing/header');
  var Partition = require('jsx!./transaction_listing/partition');
  var Transaction = require('jsx!./transaction_listing/transaction');
  var Paginator = require('jsx!./transaction_listing/paginator');
  var BalanceCalculator = require('models/balance_calculator');
  var wrapArray = require('util/wrap_array');
  var TransactionActions = require('actions/transactions');

  var activeAccount;
  var findBy = _.findBy;
  var extend = _.extend;
  var classSet = React.addons.classSet;

  var TransactionListing = React.createClass({
    getInitialState: function() {
      var partitioner = new TimePartitioner(this.props.drilldownMode, function(transaction) {
        return transaction.occurredOn;
      });

      return {
        partitioner: partitioner
      };
    },

    getDefaultProps: function() {
      return {
        dateRange: {
          from: undefined,
          to: undefined
        },
        drilldownMode: K.DRILLDOWN_MONTHS,
        accounts: [],
        transactions: [],
        categories: [],
        paymentMethods: [],
        feedCanLoadMore: false,
        feedOptions: {
          groupByDates: true
        },

        multipleAccounts: false,

        headerLabel: undefined,

        toDefaultCurrency: false,
        defaultCurrency: 'USD'
      };
    },

    componentWillReceiveProps: function(nextProps) {
      this.state.partitioner.setMode(nextProps.drilldownMode);
      this.state.partitioner.clear();
      this.state.partitioner.add(nextProps.transactions.filter(function(transaction) {
        return !transaction.isNew;
      }));
    },

    render: function() {
      var balance, upcomingBalance;
      var className = {};

      className['drilldown-' + this.props.drilldownMode] = true;
      className['no-header'] = !this.props.feedOptions.groupByDates;
      className['no-occurrence'] = this.props.feedOptions.groupByDates && [
        K.DRILLDOWN_DAYS,
        K.DRILLDOWN_SINGLE_MONTH
      ].indexOf(this.props.drilldownMode) > -1;

      className['compact'] = this.props.feedOptions.compact;

      activeAccount = findBy(this.props.accounts, {
        id: this.props.activeAccountId
      }) || {};

      balance = this.calculateBalance(this.props.transactions, true);
      upcomingBalance = this.calculateBalance(this.props.transactions, false);

      return(
        <section id="transaction_listing" className={classSet(className)}>
          <Header
            balance={balance}
            upcomingBalance={upcomingBalance}
            currency={activeAccount.currency}
            drilldownMode={this.props.drilldownMode}
            from={this.props.dateRange.from}
            to={this.props.dateRange.to}
            label={this.props.headerLabel} />

          {
            this.state.partitioner.isEmpty() ?
            <p>{t('no_transactions',
                'You have not tracked any transaction in this time period.')}</p> :
            this.props.children
          }

          {this.state.partitioner.map(this.renderPartition)}

          {
            this.props.feedCanLoadMore &&
            <footer className="actions text-center">
              <Paginator />
            </footer>
          }
        </section>
      );
    },

    renderPartition: function(partition) {
      var committedBalance = this.calculateBalance(partition.items, true);
      var upcomingBalance = this.calculateBalance(partition.items, false);

      return (
        <Partition
          id={partition.id}
          key={partition.id}
          balance={committedBalance}
          upcomingBalance={upcomingBalance}
          currency={activeAccount.currency}>
          {partition.items.map(this.renderTransaction)}
        </Partition>
      );
    },

    renderTransaction: function(originalProps) {
      var props = extend({}, originalProps);
      var categories = wrapArray(this.props.categories);
      var categoryIds = wrapArray(props.categoryIds);
      var primaryCategory;

      props.key = 'transaction-' + props.id;
      props.active = this.props.activeTransactionId === props.id;
      props.categories = categoryIds.map(function(id) {
        return findBy(categories, { id: id }).name;
      });

      props.paymentMethod = findBy(this.props.paymentMethods, {
        id: props.paymentMethodId
      });

      if (categoryIds.length) {
        primaryCategory = findBy(this.props.categories, {
          id: categoryIds[0]
        });

        props.icon = primaryCategory.icon;
      }

      props.accounts = this.props.accounts;
      props.onActivate = this.onActivate;
      props.onEdit = this.onEdit;
      props.showAccount = !!this.props.multipleAccounts;

      return Transaction(props);
    },

    onActivate: function(id) {
      TransactionActions.activate(id);
    },

    onEdit: function(id) {
      TransactionActions.edit(id);
    },

    calculateBalance: function(transactions, onlyCommitted) {
      var shouldConvert = this.props.toDefaultCurrency;
      var currency = shouldConvert ? this.props.defaultCurrency : undefined;
      var committed = onlyCommitted ? transactions.filter(function(tx) {
        return tx.committed === true;
      }) : transactions;

      return BalanceCalculator.balanceForSet(committed, currency, true);
    }
  });

  return TransactionListing;
});