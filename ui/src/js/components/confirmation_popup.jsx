/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Popup = require('jsx!components/popup');
  var t = require('i18n!components/confirmation_popup');

  var ConfirmationBox = React.createClass({
    propTypes: {
      onCancel: React.PropTypes.func.isRequired,
      onAccept: React.PropTypes.func.isRequired,
      message: React.PropTypes.string.isRequired
    },

    render: function() {
      return (
        <div className="confirmation-box">
          <div className="confirmation-message">
            {this.props.message}
          </div>

          <div className="confirmation-buttons">
            <button
              onClick={this.props.onCancel}
              data-cancel
              className="btn btn-default"
              children={t('cancel', 'Cancel')} />

            <button
              onClick={this.props.onAccept}
              className="btn btn-danger pull-right"
              children={t('accept', 'Accept')} />
          </div>
        </div>
      );
    }
  });

  /**
   * @class Components.ConfirmationPopup
   *
   * Display a small overlay popup that prompts the user for confirmation. Ideal
   * for use with dangerous-action buttons.
   */
  var ConfirmationPopup = React.createClass({
    propTypes: {
      onAccept: React.PropTypes.func.isRequired,
      position: React.PropTypes.oneOf([ 'top', 'right', 'bottom', 'left' ])
    },

    getDefaultProps: function() {
      return {
        position: 'top'
      };
    },

    render: function() {
      var popupOptions = {
        position: this.calculatePosition()
      };

      return(
        <Popup
          key="popup"
          ref="popup"
          popupOptions={popupOptions}
          content={ConfirmationBox}
          message={this.props.message}
          onAccept={this.props.onAccept}
          onCancel={this.dismiss}
          autoFocus="[data-cancel]"
          children={this.props.children} />
      );
    },

    dismiss: function(e) {
      e.preventDefault();
      this.refs.popup.close();
    },

    calculatePosition: function() {
      var p;

      switch(this.props.position) {
        case 'top': p = { my: 'bottom center', at: 'top center' }; break;
      }

      return p;
    }
  });

  return ConfirmationPopup;
});