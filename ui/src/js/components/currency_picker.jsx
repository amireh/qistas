/** @jsx React.DOM */
define([
  'react',
  'jsx!components/chosen'
],
function(React, Chosen) {
  var CurrencyPicker = React.createClass({
    propTypes: {
      currencies: React.PropTypes.arrayOf(React.PropTypes.string)
    },

    getDefaultProps: function() {
      return {
        currencies: [ 'USD' ]
      };
    },

    render: function() {
      return(
        <Chosen
          name="currency"
          valueLink={this.props.valueLink}
          className="with-arrow text-left add-on">
          {this.props.currencies.map(this.renderCurrency)}
        </Chosen>
      );
    },

    renderCurrency: function(currency) {
      var name;
      if (typeof currency === 'string') {
        name = currency;
      }
      else if (typeof currency === 'object') {
        console.warn(
          'You should pass an array of currency ISO Codes to ' +
          'the CurrencyPicker component, not full currency objects.' +
          'Currency:', currency
        );

        if (currency.name) {
          name = currency.name;
        }
      }
      else {
        console.warn(
          'Unknown currency object passed to CurrencyPicker:', currency
        );

        return false;
      }

      return <option key={'currency-'+name} value={name}>{name}</option>;
    }
  });

  return CurrencyPicker;
});