/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var CurrencyPicker = require('jsx!components/currency_picker');
  var Button = require('jsx!components/button');
  var t = require('i18n!transactions/editor');
  var generateUUID = require('util/generate_uuid');
  var removeByValue = require('util/remove_by_value');
  var _ = require('underscore');
  var $ = require('jquery');
  var findBy = _.findWhere;

  var classSet = React.addons.classSet;

  var Splits = React.createClass({
    getInitialState: function() {
      return {
        shouldFocus: false
      };
    },

    getDefaultProps: function() {
      return {
        amount: 0,
        splits: []
      };
    },

    // focus the amount field of a newly added split:
    componentDidUpdate: function(prevProps, prevState) {
      if (this.state.shouldFocus) {
        $(this.getDOMNode()).find('input[type="number"]:last').focus();

        this.setState({
          shouldFocus: false
        });
      }
    },

    render: function() {
      var remainder = this.getRemainder();
      var hasSplits = this.props.splits.length > 0;
      var isValid = remainder >= 0;
      var remainderClassName = {
        'tx-split-remainder': true
      };

      if (!isValid) {
        remainderClassName['invalid'] = true;
      }

      return(
        <div className="tx-amount-splits">
          {this.props.splits.map(this.renderSplit)}

          {remainder < 0 &&
            <span key="warning" className="split-overflow-warning">
              {t('overflow_warning',
                'Split total must not exceed the original amount. ' +
                'These splits will not be used unless you correct this.'
              )}
            </span>
          }

          <Button
            disabled={!isValid}
            onClick={this.addSplit}
            size="small"
            className="margined"
            type="default">
            {t('split', 'Split')}
          </Button>

          {hasSplits &&
            <small className={classSet(remainderClassName)}>
              {t('labels.split_remainder', '__amount__ remaining', {
                amount: this.getRemainder().toFixed(2)
              })}
            </small>
          }
        </div>
      );
    },

    getRemainder: function() {
      var amount = parseFloat(this.props.amount || '');

      if (isNaN(amount)) {
        amount = 0;
      }

      var splitTally = this.props.splits.reduce(function(sum, split) {
        var splitAmount = parseFloat(split.amount);

        if (isNaN(splitAmount)) {
          splitAmount = 0;
        }

        return sum += splitAmount;
      }, 0);

      return amount - splitTally;
    },

    renderSplit: function(split) {
      var id = split.id;

      return (
        <div className="tx-amount-split" key={'split-' + id}>
          <input
            type="number"
            className="form-input input-tiny"
            placeholder="1"
            step="any"
            onChange={this.changeSplitAmount.bind(null, id)}
            value={split.amount} />

          <input
            type="text"
            value={split.memo}
            className="form-input tx-split-amount"
            onChange={this.changeSplitMemo.bind(null, id)}
            placeholder={t('placeholders.split_note', 'Apple juice')} />

          <Button
            className="remove-split-btn"
            onClick={this.removeSplit.bind(null, id)}
            title={t('tooltips.remove_split', 'Remove this split')}>
            <i className="icon-minus" />
          </Button>
        </div>
      );
    },

    addSplit: function() {
      var splits = this.props.splits;

      splits.push({
        id: generateUUID()
      });

      this.updateSplits();
      this.setState({
        shouldFocus: true
      });
    },

    removeSplit: function(id) {
      var split = this.getSplit(id);

      removeByValue(split, this.props.splits);

      this.updateSplits();
    },

    changeSplitAmount: function(id, e) {
      var split = this.getSplit(id);
      var raw = e.target.value;
      var amount;
      var lastCharacter = raw[raw.length-1];

      // let "." delimiters in
      if (lastCharacter === '.' || lastCharacter === '0') {
        amount = raw;
      }
      else {
        amount = parseFloat(raw);

        if (isNaN(amount)) {
          amount = '';
        }
        else {
          amount = Math.abs(amount);
        }
      }

      split.amount = amount;

      this.updateSplits();
    },

    changeSplitMemo: function(id, e) {
      var split = this.getSplit(id);
      split.memo = e.target.value;
    },

    getSplit: function(id) {
      return findBy(this.props.splits, { id: id });
    },

    updateSplits: function() {
      this.props.linkState('splits').requestChange(this.props.splits);
    }
  });

  return Splits;
});