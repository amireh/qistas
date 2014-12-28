define(function(require) {
  var _ = require('ext/underscore');
  var Pixy = require('pixy');
  var moment = require('moment');
  var wrap = require('util/wrap_array');
  var K = require('constants');

  var AMOUNT_TEST_TYPES = [ 'GT', 'LT', 'EQ' ];
  var TRANSACTION_TYPES = [ 'expense', 'income', 'transfer' ];
  var WEEK_DAYS = K.DAYS_OF_WEEK;
  var intersection = _.intersection;
  var contains = _.contains;

  var TransactionFilterer = Pixy.Object.extend({
    initialize: function(collection) {
      this.collection = collection;
    },

    filterByAmount: function(amount, testType) {
      if (!contains(AMOUNT_TEST_TYPES, testType) || !amount || amount < 0) {
        return this.collection.removeFilter('amount');
      }

      this.collection.addFilter('amount', {
        amount: parseFloat(amount),
        type: testType
      }, {
        condition: function(amount, options) {
          var rc;

          switch (options.type) {
            case 'GT':
              rc = amount > options.amount;
            break;
            case 'LT':
              rc = amount < options.amount;
            break;
            case 'EQ':
              rc = amount === options.amount;
            break;
          }

          return !rc;
        }
      });
    },

    filterByNote: function(note) {
      note = (note || '').toLowerCase();

      if (!note.length) {
        return this.collection.removeFilter('note');
      }

      this.collection.addFilter('note', note.toLowerCase(), {
        condition: function(k, v) {
          return (k || '').toLowerCase().indexOf(v) === -1;
        }
      });
    },

    filterByType: function(type) {
      type = (type || '').toLowerCase();

      if (!contains(TRANSACTION_TYPES, type)) {
        return this.collection.removeFilter('type');
      }

      this.collection.addFilter('type', type.toLowerCase());
    },

    filterByCategory: function(categoryIds) {
      categoryIds = wrap(categoryIds);

      if (!categoryIds.length) {
        return this.collection.removeFilter('category_ids');
      }

      this.collection.addFilter('category_ids', categoryIds, {
        condition: function(k,v) {
          return intersection(k,v).length === 0;
        }
      });
    },

    filterByPaymentMethod: function(paymentMethodIds) {
      paymentMethodIds = wrap(paymentMethodIds);

      if (!paymentMethodIds.length) {
        return this.collection.removeFilter('payment_method_id');
      }

      this.collection.addFilter('payment_method_id', paymentMethodIds, {
        condition: function(id, collection) {
          return !contains(collection, id);
        }
      });
    },

    filterByAttachment: function(present) {
      if (!contains([true,false], present)) {
        return this.collection.removeFilter('attachments');
      }

      this.collection.addFilter('attachments', present, {
        condition: function(set, present) {
          if (present) {
            return !set || set.length === 0;
          }
          else {
            return set && set.length > 0;
          }
        }
      });
    },

    filterByDaysOfMonth: function(days) {
      days = wrap(days).map(function(day) {
        return parseInt(day, 10);
      });

      if (!days.length) {
        return this.collection.removeFilter('daysOfMonth');
      }

      this.collection.addFilter('occurred_on', days, {
        name: 'daysOfMonth',
        condition: function(occurredOn, days) {
          return !contains(days, moment.utc(occurredOn).date());
        }
      });
    },

    filterByDaysOfWeek: function(days) {
      var weekDays = wrap(days).map(function(weekDay) {
        return String(weekDay).capitalize();
      }).filter(function(weekDay) {
        return contains(WEEK_DAYS, weekDay.toLowerCase());
      });

      if (!weekDays.length) {
        return this.collection.removeFilter('weekDays');
      }

      this.collection.addFilter('occurred_on', weekDays, {
        name: 'daysOfWeek',
        condition: function(occurredOn, weekDays) {
          return !contains(weekDays, moment.utc(occurredOn).format('dddd'));
        }
      });
    }
  });

  return TransactionFilterer;
});