/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var _ = require('ext/underscore');
  var t = require('i18n!transaction_editor');
  var Common = require('./common');
  var Popup = require('jsx!components/popup');
  var PaymentMethodPicker = require('jsx!components/payment_method_picker');
  var Label = require('jsx!components/sidebar_label');
  var findBy = _.findBy;

  var PaymentMethodPickerPopup = React.createClass({
    propTypes: {
      linkState: React.PropTypes.func.isRequired,
      paymentMethods: React.PropTypes.array.isRequired,
      paymentMethodId: React.PropTypes.string
    },

    render: function() {
      var selectionId = String(this.props.paymentMethodId);
      var selection = findBy(this.props.paymentMethods, {
        id: selectionId
      });

      return (
        <Popup
          key="payment-method-picker"
          content={PaymentMethodPicker}
          popupOptions={Common.popupOptions}
          items={this.props.paymentMethods}
          valueLink={this.props.linkState('paymentMethodId')}
          autoFocus="input:first">
          <Label
            key="payment_method"
            icon="icon-credit"
            label={t('labels.payment_method', 'Payment Method')}>
            {(selection || {}).name}
          </Label>
        </Popup>
      );
    }
  });

  return PaymentMethodPickerPopup;
});