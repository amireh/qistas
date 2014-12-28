/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var SelectableMixin = require('mixins/selectable');

  /**
   * @class Components.PaymentMethodPicker
   *
   * [brief component description]
   */
  var PaymentMethodPicker = React.createClass({
    mixins: [ SelectableMixin ],

    propTypes: {
      items: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        name: React.PropTypes.string,
        color: React.PropTypes.string
      }))
    },

    getDefaultProps: function() {
      return {
        items: [],
        multiple: false,
        colored: true
      };
    },

    render: function() {
      return (
        <div className="payment-method-picker" onChange={this.onChange}>
          {this.props.items.map(this.renderItem)}
        </div>
      );
    },

    renderItem: function(item) {
      var tagType = this.props.multiple ? 'checkbox' : 'radio';
      var className = this.props.multiple ? 'skinned-checkbox' : 'skinned-radio';
      var styles = {
        'background-color': '#' + item.color
      };

      return (
        <label className={className} key={item.id}>
          {this.props.colored && <i style={styles} />}

          <input
            readOnly
            type={tagType}
            value={item.id}
            checked={this.isChecked(item.id)} />

          <span children={item.name} />
        </label>
      );
    }
  });

  return PaymentMethodPicker;
});