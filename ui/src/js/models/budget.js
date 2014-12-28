define(function(require) {
  var _ = require('ext/underscore');
  var Pixy = require('ext/pixy');
  var t = require('i18n!budgets');
  var BudgetDescriptor = require('./budget_descriptor');
  var K = require('constants');

  var Model = Pixy.Model;

  /**
   * @class Pibi.Models.Budget
   * @singleton
   * @extends Pixy.Model
   *
   * A budget.
   */
  return Model.extend(/*HasManyCategories, HasOneAccount, HasOnePaymentMethod, */{
    name: 'Budget',

    defaults: {
      currency: 'USD',
      interval: 'months',
      is_ratio: false,
      completion: 0
    },

    urlRoot: function() {
      return this.collection.url();
    },

    normalize: function(data) {
      if (data.every) {
        data.every = parseInt(data.every, 10);

        if (isNaN(data.every) || data.every < 1) {
          data.every = 1;
        }
      }

      if (data.quantifier) {
        data.quantifier = parseInt(data.quantifier, 10);

        if (isNaN(data.quantifier) || data.quantifier < 0) {
          data.quantifier = 0;
        }
      }

      if (data.is_ratio) {
        data.is_ratio = _.toBoolean(data.is_ratio);
      }
    },

    binding: function() {
      var contextType = this.bindingType();

      if (contextType === K.BUDGET_ACCOUNT_CONTEXT) {
        return this.user().accounts.get(this.get('account_id'));
      }
      else if (contextType === K.BUDGET_PAYMENT_METHOD_CONTEXT) {
        return this.user().paymentMethods.get(this.get('payment_method_id'));
      }
      else if (contextType === K.BUDGET_CATEGORY_CONTEXT) {
        var categoryIds = this.get('category_ids');

        return this.user().categories.filter(function(category) {
          return categoryIds.indexOf(category.get('id')) > -1;
        });
      }
      else {
        return null;
      }
    },

    bindingType: function() {
      return this.get('context_type');
    },

    bindingName: function() {
      var bindingType = this.bindingType();

      switch(bindingType) {
        case 'account':
        case 'payment_method':
          return this.binding().get('name');
        break;
        case 'categories':
          return _.invoke(this.binding(), 'get', 'name').join(', ');
        break;
      }
    },

    isSavings: function() {
      return this.get('goal') === 'savings_control';
    },

    isSpendings: function() {
      return this.get('goal') === 'spendings_control';
    },

    isFrequency: function() {
      return this.get('goal') === 'frequency_control';
    },

    isRatio: function() {
      return !!this.get('is_ratio');
    },

    isComplete: function() {
      return parseInt(this.get('completion'), 10) === 100;
    },

    isOverflown: function() {
      return this.get('overflow') > 0;
    },

    isUnderflown: function() {
      return this.get('underflow') > 0;
    },

    // TODO: so i think this warrants its own class actually, and a model is
    // hardly the place to do i18n grunt work, so move it
    description: function() {
      return BudgetDescriptor.describe(this);
    },

    progressLabel: function() {
      return BudgetDescriptor.progressLabel(this);
    },

    // TODO: can we please figure out a way to get rivet decorators to work on a
    // collection item(s)?
    showUrl: function() {
      return [ '/budgets', this.get('id') ].join('/');
    },

    // TODO: same as #showUrl
    editUrl: function() {
      return this.showUrl() + '/edit';
    },

    user: function() {
      return this.collection.user;
    },

    renderableCompletion: function() {
      var completion = this.get('completion');
      var renderableCompletion;

      if (this.get('goal') === 'spendings_control') {
        renderableCompletion = 100 - completion;
      }
      else {
        renderableCompletion = completion;
      }

      return renderableCompletion;
    },

    toProps: function() {
      var data;

      data = Model.prototype.toProps.call(this);
      data.progressLabel = this.progressLabel();
      data.renderableCompletion = this.renderableCompletion();

      return data;
    }
  });
});