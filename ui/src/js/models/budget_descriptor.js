define([
  'ext/pixy',
  'ext/underscore',
  'i18n!budgets',
  'constants'
], function(Pixy, _, t, K) {
  var Descriptor = Pixy.Object.extend({
    describe: function(budget) {
      return this.describeFromAttrs({
        contextType: budget.get('context_type'),
        context: budget.binding(),
        currency: budget.get('currency'),
        quantifier: budget.get('quantifier'),
        every: budget.get('every'),
        interval: budget.get('interval'),
        goal: budget.get('goal'),
        isRatio: budget.get('is_ratio'),
      });
    },

    describeFromAttrs: function(attrs) {
      var isRatio = attrs.isRatio;
      var contextType = attrs.contextType;
      var context = attrs.context;
      var currency = attrs.currency;
      var quantifier = attrs.quantifier;
      var every = attrs.every;
      var interval = attrs.interval;
      var goal = attrs.goal;
      var message;

      var options = {};
      var key = [ 'description', goal ];

      options.quantifier = quantifier;
      options.count = goal === K.BUDGET_FREQUENCY_CONTROL ? options.quantifier : every;
      options.currency = currency;

      hasQuantifier = options.quantifier > 0;
      hasInterval = interval && every;

      if (context && goal !== K.BUDGET_SAVINGS_CONTROL) {
        if (contextType === K.BUDGET_CATEGORY_CONTEXT) {
          options.categories = context.map(function(category) {
            return category.name
          }).join(', ');

          if (!options.categories.length) {
            options.categories = '...';
          }

          key.push('with_categories');
        }
        else if (contextType === K.BUDGET_PAYMENT_METHOD_CONTEXT) {
          options.payment_method = context.name;
          key.push('with_payment_method');
        }
      }

      switch(goal) {
        case K.BUDGET_SAVINGS_CONTROL:
          if (hasQuantifier && hasInterval) {
            key.push('with_interval_and_quantifier');
            key.push(interval);
          }
          else if (hasInterval) {
            key.push('with_interval');
            key.push(interval);
          }
          else {
            key.push('blank');
          }
        break;
        case K.BUDGET_SPENDINGS_CONTROL:
          if (context) {
            if (hasQuantifier && hasInterval) {
              key.push('with_quantifier_and_interval');
              key.push(interval);
            }
            else if (hasQuantifier) {
              key.push('with_quantifier');
            }
            else {
              key.push('blank');
            }
          }
          else {
            key.push('blank');
          }
        break;

        case K.BUDGET_FREQUENCY_CONTROL:
          if (context) {
            if (hasQuantifier && hasInterval) {
              key.push('with_quantifier_and_interval');
              key.push(interval);
            }
            else {
              key.push('blank');
            }
          }
          else {
            key.push('blank');
          }
        break;
      }

      if (!key[key.length-1]) {
        return '';
      }

      message = t(key.join('.'), options);

      if (isRatio) {
        message = message.replace(/[\d|,]+\s[A-Z]{3}/, options.quantifier + '%');
      }

      return message;
    },

    progressLabel: function(budget) {
      if (budget.isSavings()) {
        return this.progressLabelForSavings(budget);
      }
      else if (budget.isSpendings()) {
        return this.progressLabelForSpendings(budget);
      }
      else if (budget.isFrequency()) {
        return this.progressLabelForFrequency(budget);
      }
    },

    progressLabelForSavings: function(budget) {
      var options = {
        total: budget.get('total'),
        currency: budget.get('currency'),
        overflow: budget.get('overflow'),
        underflow: budget.get('underflow'),
        escapeInterpolation: true
      };

      if (budget.isOverflown()) {
        return t('goal_status.savings.overflown',
          'Congratulations! You have achieved your goal and more.', options);
      }
      else if (budget.isComplete()) {
        return t('goal_status.savings.complete',
            'Congratulations! You have achieved your goal.', options);
      }
      else {
        if (budget.isRatio() && options.underflow === 0 && options.total === 0) {
          return t('goal_status.savings.no_incomes_made_yet',
            'You have not earned any income yet to save from.'
          );
        }

        return t('goal_status.savings.in_progress',
          'You have not achieved your goal yet.', options);
      }
    },

    progressLabelForSpendings: function(budget) {
      var options = {
        total: budget.get('total'),
        currency: budget.get('currency'),
        overflow: budget.get('overflow'),
        underflow: budget.get('underflow'),
        escapeInterpolation: true,
        context: budget.bindingType(),
        target: budget.bindingName()
      };

      if (budget.isOverflown()) {
        return t('goal_status.spendings.overflown',
          'You are spending too much!', options);
      }
      else if (budget.isComplete()) {
        return t('goal_status.spendings.complete',
            'Watch out! You have reached your limit for this budget period.', options);
      }
      else {
        return t('goal_status.spendings.in_progress',
          "You're safe. You are still within the budget.", options);
      }
    },

    progressLabelForFrequency: function(budget) {
      var options = {
        total: budget.get('total'),
        currency: budget.get('currency'),
        overflow: budget.get('overflow'),
        underflow: budget.get('underflow'),
        escapeInterpolation: true,
        context: budget.bindingType(),
        target: budget.bindingName()
      };

      if (budget.isOverflown()) {
        return t('goal_status.frequency.overflown',
          'You have spent money too many times!', options);
      }
      else if (budget.isComplete()) {
        return t('goal_status.frequency.complete',
          'Watch out! You should not spend any more money.', options);
      }
      else {
        return t('goal_status.frequency.in_progress',
          "You're safe. You are still within the budget.", options);
      }
    }
  });

  return new Descriptor();
});