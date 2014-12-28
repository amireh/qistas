/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!dashboard/favorite_budgets');
  var ProgressBar = require('jsx!components/progress_bar');
  var Budget = require('jsx!apps/budgets/js/views/index/budget');
  var clone = require('underscore').clone;

  var FavoriteBudgets = React.createClass({
    getDefaultProps: function() {
      return {
        budgets: []
      };
    },

    render: function() {
      return(
        <div className="budget-index list-view">
          <div className="budget-listing">
            {this.props.budgets.length === 0 &&
              t.htmlSafe('empty_note',
                'You have not marked any budget as favorite. ' +
                'Click <a href="/budgets">here</a> to manage your budgets.'
              )
            }
            {this.props.budgets.map(this.decorateBudget).map(this.renderBudget)}
          </div>
        </div>
      );
    },

    decorateBudget: function(budget) {
      var props = clone(budget);
      props.key = 'budget'+props.id;
      return props;
    },

    renderBudget: function(budget) {
      return Budget(budget);
    },

    renderBudget_: function(budget) {
      return (
        <li key={'budget'+budget.id}>
          <span className="budget-name">{budget.name}</span>

          <div className="budget-progress">
            <ProgressBar progress={budget.renderableCompletion} />
          </div>
        </li>
      );
    }
  });

  return FavoriteBudgets;
});