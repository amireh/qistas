define(function(require) {
  var Pixy = require('pixy');
  var user = require('core/session').user;
  var Filterer = require('models/transaction_filterer');
  var analytics = require('actions/analytics');
  var filterBox;
  var TRACKABLE_FILTERS = [
    'amount',
    'note',
    'type',
    'hasAttachment',
    'categoryIds',
    'paymentMethodIds',
    'daysOfWeek',
    'daysOfMonth',
    'invertFilters',
    'clearFilters'
  ];

  var store = new Pixy.Store('transactionFilters', {
    collection: undefined,

    actions: {
      /**
       * Apply a given set of filters on the current transaction collection.
       *
       * @param {Object} filters
       *
       * @param {String|Number} filters.amount
       *        An amount filter.
       *
       * @param {"GT"|"LT"|"EQ"} filters.amountTestType
       *        What to do with filters.amount.
       *
       * @param {String} filters.note
       *        Filter transactions by their note content.
       *
       * @param {"expense"|"income"|"transfer"} type
       *        Filter transactions by type.
       *
       * @param {String[]} categoryIds
       *        Filter transactions that are tagged by the given categories.
       *
       * @param {String[]} paymentMethodIds
       *        Filter transactions that are tagged by the given payment
       *        methods.
       *
       * @param {Number[]} daysOfMonth
       *        Filter transactions that have occurred on any certain day.
       *
       * @param {String[]} daysOfWeek
       *        Filter transactions that have occurred on any certain day of the
       *        week. Days of week are lowercased, e.g: "sunday", "tuesday".
       *
       * @param {Boolean} hasAttachment
       *        Filter transactions by the presence of an attachment.
       *
       * @param {Boolean} [clearFilters=true]
       *        If true, all existing filters will be cleared before applying
       *        the new ones.
       *
       * @param {Boolean} [invertFilters=false]
       *        If true, the specified filters will be negated.
       *
       */
      apply: function(filters, onChange) {
        var collection = this.collection;

        if (filters.clearFilters) {
          collection.resetFilters();
        }

        collection.invertFilters(!!filters.invertFilters);

        filterBox.filterByAmount(filters.amount, filters.amountTestType);
        filterBox.filterByNote(filters.note);
        filterBox.filterByType(filters.type);
        filterBox.filterByAttachment(filters.hasAttachment);
        filterBox.filterByCategory(filters.categoryIds);
        filterBox.filterByPaymentMethod(filters.paymentMethodIds);
        filterBox.filterByDaysOfMonth(filters.daysOfMonth);
        filterBox.filterByDaysOfWeek(filters.daysOfWeek);

        collection.applyFilters();

        (function trackUsedFilters() {
          var usedFilters = TRACKABLE_FILTERS.reduce(function(hsh, filter) {
            hsh[filter] = !!filters[filter];
            return hsh;
          }, {});

          analytics.filterTransactions(usedFilters);
        }());

        onChange();
      },

      reset: function(params, onChange) {
        var collection = this.collection;
        collection.resetFilters();
        onChange();
      }
    },

    reset: function() {
      if (this.collection) {
        this.collection.resetFilters();
        this.collection = undefined;
      }
    }
  });

  user.on('change:activeAccount', function(account) {
    store.reset();
    store.collection = account.transactions;
    filterBox = new Filterer(store.collection);
  });

  return store;
});