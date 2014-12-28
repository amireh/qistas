/** @jsx React.DOM */
define([
  'ext/react',
  'i18n!dialogs/change_password',
  'jsx!components/dialog',
  'jsx!components/save_button'
], function(React, t, Dialog, SaveButton) {
  var ChangePasswordDialog = React.createClass({
    mixins: [
      React.addons.LinkedStateMixin,
      React.addons.FormErrorsMixin,
      React.addons.ActorMixin
    ],

    getInitialState: function() {
      return {
      };
    },

    render: function() {
      return(
        <Dialog
          onClose={this.props.onClose}
          title={t('title', 'Reset Your Password')}
          autoFocus='[name="reset_password_token"]'
          thin>
          <div className="vertical-form">
            <i className="icon-pibi-framed icon-64"> </i>
            <p className="dialog-section">
              {t('message',
                "Write down the code you received in the password-change email, " +
                "and then choose a new password.")
              }
            </p>
            <form
              ref="form"
              onSubmit={this.consume}
              noValidate
              className="dialog-section">

              <input
                autoFocus
                type="text"
                name="reset_password_token"
                valueLink={this.linkState('code')}
                className="form-input input-large"
                placeholder={t('placeholders.code', 'Change password code')} />

              <input
                type="password"
                name="password"
                valueLink={this.linkState('password')}
                className="form-input input-large"
                placeholder={t('placeholders.new_password', 'Enter new password')} />

              <input
                type="password"
                name="password_confirmation"
                valueLink={this.linkState('passwordConfirmation')}
                className="form-input input-large"
                placeholder={t('placeholders.confirm_password', 'Confirm new password')} />

              <SaveButton
                ref="saveButton"
                onClick={this.onSubmit}
                className="primary"
                overlay
                paddedOverlay
                children={t('buttons.submit', 'Change password')}
                />
            </form>
          </div>

          <hr />

          <p className="dialog-section">
            {t.htmlSafe('links.link_to_login',
              'Back to <a href="/login">log-in</a>')
            }
          </p>
        </Dialog>
      );
    },

    onSubmit: function(e) {
      var saveButton = this.refs.saveButton;
      var showFormError = this.showFormError;
      var sendAction = this.sendAction;

      e.preventDefault();

      saveButton.markLoading();
      this.clearFormError();

      sendAction('users:changeResettedPassword', {
        code: this.state.code,
        password: this.state.password,
        passwordConfirmation: this.state.passwordConfirmation
      }).then(function() {
        sendAction('session:login', { refresh: true });
      });

      this.controlButton('saveButton');
    },

    controlButton: React.addons.DraftStateMixin.controlButton
  });

  return ChangePasswordDialog;
});