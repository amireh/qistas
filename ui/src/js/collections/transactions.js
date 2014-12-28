define(function(require) {
  var _ = require('ext/underscore');
  var Pixy = require('ext/pixy');
  var Transaction = require('models/transaction');
  var moment = require('moment');
  var Config = require('config');
  var K = require('constants');
  var API_DATE_FORMAT = Config.apiDateFormat;

  /**
   * @class  Pibi.Collections.Transactions
   * @extends Pixy.Collection
   *
   * Account income and expense transactions.
   *
   * @alternateClassName Transactions
   */
  return Pixy.Collection.extend(Pixy.Mixins.FilterableCollection, {
    name: 'TransactionCollection',
    model: Transaction,

    journal: {
      scope: 'account',
      collection: 'transactions'
    },

    format: Config.apiDateFormat,

    url: function() {
      return this.urlWithSuffix('');
    },

    urlWithSuffix: function(suffix) {
      var url = this.account.get('links.transactions');

      url += suffix;
      url += '?from=' + this.from.format(this.format);
      url += '&to=' + this.to.format(this.format);

      if (this.type) {
        url += '&type=' + this.type;
      }

      url += '&page=' + (this.meta.currentPage || 1);

      return url;
    },

    initialize: function() {
      /**
       * @property {Moment} from
       * Start of the time range this transaction collection covers.
       */
      this.from = moment();

      /**
       * @property {Moment} to
       * End of the time range this transaction collection covers.
       */
      this.to = moment();

      /**
       * @property {String} drilldownMode
       * 'days', 'months', or 'years' based on the date range.
       */
      this.drilldownMode = K.DRILLDOWN_DAYS;
    },

    /**
     * Calculate the balance of all matching transactions in this collection.
     *
     * @param  {Object} [query={}]
     *         A selector to filter the transactions by.
     *
     * @return {Float}
     *         The signed balance in the account currency.
     */
    balance: function(query, bunchOfModels) {
      var models, balance;

      if (bunchOfModels) {
        models = bunchOfModels;
      } else {
        models = query ? this.where(query) : this.models;
      }

      balance = models.reduce(function(balance, transaction) {
        return balance + transaction.getSignedAmount();
      }, 0);

      return _.toFloat(balance || 0);
    },

    expenses: function() {
      return this.where({ type: 'expense' });
    },

    incomes: function() {
      return this.where({ type: 'income' });
    },

    isCovered: function(/*tx*/) {
      throw "not implemented yet";
    },

    ensureCoverage: function(tx) {
      if (!this.isCovered(tx)) {
        console.warn('Transaction does not fit in my domain, removing...');
        console.warn(tx);

        this.remove(tx);
      }
    },

    setRange: function(from, to, format) {
      if (_.isString(from) && _.isString(to)) {
        from = moment(from, format);
        to = moment(to, format);
      }

      this.from = from;
      this.to = to;

      this.drilldownMode = this.determineDrilldownMode(from, to);
      this.trigger('change:drilldownMode');
    },

    determineDrilldownMode: function(from, to) {
      var nrDays = to.diff(from, 'days');

      if (nrDays < 1) {
        return K.DRILLDOWN_TODAY;
      } else if (nrDays < 2) {
        return K.DRILLDOWN_YESTERDAY;
      } else if (nrDays <= 31) {
        // check if from/to are exactly at the start and end of the month:
        //
        // note: we're casting/formatting to the api format to get rid of
        // hours, as endOf('month') would set the date to 23:59:59 and from/to
        // have a precision of only DD/MM/YYYY
        if (
          from.format(API_DATE_FORMAT) === from.clone().startOf('month').format(API_DATE_FORMAT)
          &&
          to.format(API_DATE_FORMAT) === to.clone().endOf('month').format(API_DATE_FORMAT)
        ) {
          return K.DRILLDOWN_SINGLE_MONTH;
        }

        return K.DRILLDOWN_DAYS;
      }
      else if (nrDays < 365) {
        return K.DRILLDOWN_MONTHS;
      }
      else {
        return K.DRILLDOWN_YEARS;
      }
    },

    /**
     * @private
     *
     * A comparator for sorting the transactions by their occurrence, latest to
     * oldest.
     */
    comparator: function(model) {
      var occurrence = moment(model.get('occurred_on'));

      return -1 * occurrence.unix();
    }
  });
});
