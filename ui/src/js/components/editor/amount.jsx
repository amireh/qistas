/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var CurrencyPicker = require('jsx!components/currency_picker');
  var Splits = require('jsx!./amount_splits');

  var classSet = React.addons.classSet;

  var Amount = React.createClass({
    propTypes: {
      linkState: React.PropTypes.func.isRequired,
      currencies: React.PropTypes.array.isRequired,
      margined: React.PropTypes.bool
    },

    getDefaultProps: function() {
      return {
        currencies: [],
        margined: false,
        splits: [],
        splittable: false
      };
    },

    render: function() {
      var className = classSet({
        'amount-group': true,
        'margined': this.props.margined
      });

      return(
        <div>
          <div className={className}>
            <input
              name="amount"
              ref="focusNode"
              type="number"
              className="form-input"
              placeholder="1"
              step="any"
              valueLink={this.props.linkState('amount')}
              autoFocus />

            <CurrencyPicker
              valueLink={this.props.linkState('currency')}
              currencies={this.props.currencies} />
          </div>

          {this.props.splittable && this.renderSplits()}
        </div>
      );
    },

    focus: function() {
      this.refs.focusNode.getDOMNode().focus();
    },

    renderSplits: function() {
      return <Splits
        linkState={this.props.linkState}
        splits={this.props.splits}
        amount={this.props.amount} />;
    }

  });

  return Amount;
});