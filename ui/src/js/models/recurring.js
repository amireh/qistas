define(function(require) {
  var moment = require('moment');
  var _ = require('ext/underscore');
  var GenericTransaction = require('models/generic_transaction');
  var t = require('i18n!recurring_model');
  var ConvertCase = require('util/convert_case');
  var Psync = require('psync');

  /**
   * @class  Pibi.Models.Recurring
   * @extends Pibi.Models.GenericTransaction
   * @alternateClassName RecurringModel
   *
   * A recurring transaction.
   */
  return GenericTransaction.extend({
    name: 'Recurring',
    mixins: [ Psync.Adapters.Pixy.ModelMixin ],

    psync: {
      collectionKey: 'recurrings',
      scopeKey: 'account'
    },

    defaults: {
      amount: 0,
      type: 'recurring',
      name: '',
      frequency: 'daily',
      every: 1,
      weekly_days: [],
      monthly_days: [],
      yearly_day: 1,
      yearly_months: [],
      active: true,
      flow_type: 'positive',
      payment_method_id: '',
      category_ids: [],
    },

    urlRoot: function() {
      return this.collection.account.get('links.recurrings');
    },

    validate: function(data) {
      console.debug('validating recurring data:', data);

      if (!data.name || !data.name.length) {
        return { name: '[RTX:MISSING_NAME] You must provide a name for this recurring.' };
      }

      if (!data.amount || _.toFloat(data.amount) <= 0.0) {
        return { amount: '[RTX:BAD_AMOUNT] Recurring amount must be a positive number.' };
      }

      if (!data.every) {
        return { every: '[RTX:MISSING_EVERY] You must provide an "every" interval quantifier.' };
      }
      else if (parseInt(data.every, 10) < 1) {
        return { every: '[RTX:BAD_EVERY] The "every" interval quantifier must be a positive integer.' };
      }

      if ([ 'daily', 'weekly', 'monthly', 'yearly' ].indexOf(data.frequency) === -1) {
        return { frequency: '[RTX:MISSING_FREQUENCY] Frequency must be one of daily, weekly, monthly, or yearly.'};
      }

      switch(data.frequency) {
        case 'weekly':
          if (!(data.weekly_days || []).length) {
            return { frequency: '[RTX:MISSING_WEEKLY_DAYS] Missing days of week.' };
          }
        break;

        case 'monthly':
          if (!(data.monthly_days || []).length) {
            return { frequency: '[RTX:MISSING_MONTHLY_DAYS] Missing days of month.' };
          }
        break;

        case 'yearly':
          if (!(data.yearly_months || []).length) {
            return { frequency: '[RTX:MISSING_YEARLY_MONTHS] Missing months of year.' };
          }

          if (!data.yearly_day) {
            return { frequency: '[RTX:MISSING_YEARLY_DAY] Missing yearly day.' };
          }
        break;
      }

      return GenericTransaction.prototype.validate.apply(this, arguments);
    },

    getCoefficient: function() {
      return this.isNegative() ? -1 : 1;
    },

    isPositive: function() {
      return this.get('flow_type') === 'positive';
    },

    isNegative: function() {
      return !this.isPositive();
    },

    /**
     * @override
     */
    toString: function() {
      return '' +
        this.get('name') + ':' +
        this.get('amount') +
        [ '(', this.get('flow_type'), ')' ].join('') +
        [ this.get('frequency'), this.get('summary') ].join(' - ');
    },

    normalize: function(payload) {
      ConvertCase.toInteger(payload, 'every');
      ConvertCase.toInteger(payload, 'monthly_days');
      ConvertCase.toInteger(payload, 'yearly_months');
      ConvertCase.toInteger(payload, 'yearly_day');
    },

    occurrencesInMonth: function(month) {
      /*jshint -W027*/
      switch(this.get('frequency')) {
        case 'daily':
          return this.dailyOccurrencesInMonth(month.clone());
          break;
        case 'weekly':
          return this.weeklyOccurrencesInMonth(month.clone());
          break;
        case 'monthly':
          return this.monthlyOccurrencesInMonth(month.clone());
          break;
        case 'yearly':
          return this.yearlyOccurrencesInMonth(month.clone());
          break;
      }

      return [];
    },

    dailyOccurrencesInMonth: function(month) {
      var every = this.get('every');
      var createdAt = moment.utc(this.get('created_at')).startOf('day');
      var startingDay = createdAt.date();

      // if the day of creation was odd, then we'll need this modifier in our
      // tests to make sure the first occurrence starts on the day of the
      // creation (this is consistent with the back-end)
      var modifier = startingDay % 2 === 0 ? 0 : 1;

      var daysInMonth = month.daysInMonth();

      // 1 and +1 because day indexes start from 1
      var dayRange = _.range(1, daysInMonth+1);

      return _.chain(dayRange)
        .map(function(day) {
          if ((day+modifier) % every === 0) {
            return moment.utc([ month.year(), month.month(), day ]);
          }
        })
        // nulls would be the days that are not covered by the "every"
        // specifier
        .compact()
        // remove all dates that are earlier than the date the model was
        // created at
        .reject(function(date) {
          return date.isBefore(createdAt);
        })
        .value();
    },

    weeklyOccurrencesInMonth: function(month) {
      var every = this.get('every');
      var createdAt = moment.utc(this.get('created_at')).startOf('day');
      var dayIndices = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

      // integers, 0 for sunday, 6 for saturday
      var weeklyDays = _.map(this.get('weekly_days'), function(weeklyDay) {
        return dayIndices.indexOf(weeklyDay);
      });

      var dayRange = _.range(1, month.daysInMonth()+1);
      var firstWeek = createdAt.week();

      return _.chain(dayRange)
        .map(function(dayOfMonth) {
          var date = moment.utc([ month.year(), month.month(), dayOfMonth ]);
          var dayOfWeek = date.day();

          if ((date.week() - firstWeek) % every === 0) {
            if (weeklyDays.indexOf(dayOfWeek) > -1) {
              return date;
            }
          }
        })
        .compact()
        .reject(function(date) {
          return date.isBefore(createdAt);
        })
        .value();
    },

    monthlyOccurrencesInMonth: function(month) {
      var every = this.get('every');
      var createdAt = moment.utc(this.get('created_at')).startOf('day');
      var monthlyDays = this.get('monthly_days');

      var dayRange = _.range(1, month.daysInMonth()+1);

      if ((month.month() - createdAt.month()) % every !== 0) {
        return [];
      }

      return _.chain(dayRange)
        .map(function(dayOfMonth) {
          var date = moment.utc([ month.year(), month.month(), dayOfMonth ]);

          if (monthlyDays.indexOf(dayOfMonth) > -1) {
            return date;
          }
        })
        .compact()
        .reject(function(date) {
          return date.isBefore(createdAt);
        })
        .value();
    },

    yearlyOccurrencesInMonth: function(month) {
      var every = this.get('every');
      var createdAt = moment.utc(this.get('created_at')).startOf('day');
      var yearlyDay = this.get('yearly_day');
      var yearlyMonths = this.get('yearly_months');

      if (yearlyMonths.indexOf(month.month()) === -1) {
        return [];
      }
      else if ((month.year() - createdAt.year()) % every !== 0) {
        return [];
      }

      return [ moment.utc([ month.year(), month.month(), yearlyDay ]) ];
    },

    toProps: function() {
      var props = this.pick([
        'id',
        'name',
        'amount',
        'flow_type',
        'currency',
        'frequency',
        'active',
        'every',
        'next_billing_date',
        'category_ids',
        'payment_method_id',
        'weekly_days',
        'monthly_days',
        'yearly_months',
        'yearly_day',
        'links'
      ]);

      props.isNew = this.isNew();
      props.sortableName = this.get('name').toLowerCase();
      props.signedAmount = this.getSignedAmount();
      props.accountCurrency = this.getAccount().get('currency');
      props.rawAmount = this.get('amount') * this.getCoefficient();
      props.attachments = this.attachments.toProps();
      props.coefficient = this.getCoefficient();

      ConvertCase.toString(props, 'weekly_days');
      ConvertCase.toString(props, 'monthly_days');
      ConvertCase.toString(props, 'yearly_months');
      ConvertCase.toString(props, 'yearly_day');

      return ConvertCase.camelize(props);
    },

    toPsync: function(isUpdating) {
      var data = this.pick([
        'id',
        'name',
        'amount',
        'flow_type',
        'currency',
        'frequency',
        'every',
        'category_ids',
        'payment_method_id',
        'weekly_days',
        'monthly_days',
        'yearly_months',
        'yearly_day',
      ]);

      if (isUpdating) {
        delete data.id;
        delete data.type;
      }

      this.normalize(data);

      return data;
    }
  });
});