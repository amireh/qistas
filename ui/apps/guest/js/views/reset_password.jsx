/** @jsx React.DOM */
define([
  'ext/react',
  'i18n!dialogs/reset_password',
  'jsx!components/dialog',
  'jsx!components/save_button'
], function(React, t, Dialog, SaveButton) {
  var ResetPasswordDialog = React.createClass({
    mixins: [
      React.addons.LinkedStateMixin,
      React.addons.FormErrorsMixin,
      React.addons.ActorMixin
    ],

    getInitialState: function() {
      return {
        email: null
      };
    },

    render: function() {
      return(
        <Dialog
          onClose={this.props.onClose}
          title={t('title', 'Reset Your Password')}
          autoFocus='[name="email"]'
          thin>
          <div className="vertical-form">
            <i className="icon-pibi-framed icon-64"> </i>
            <p className="dialog-section">
              {t('message',
                "Write down the email you used for signing up to Pibi and " +
                "we'll send you further instructions on how to change your " +
                "password.")
              }
            </p>
            <form
              ref="form" onSubmit={this.onSubmit}
              noValidate
              className="dialog-section">
              <input
                type="email"
                name="email"
                placeholder={t('placeholders.email', 'Email')}
                autoFocus
                ref="autoFocusNode"
                valueLink={this.linkState('email')}
                className="form-input" />

              <SaveButton
                ref="saveButton"
                onClick={this.onSubmit}
                className="primary"
                overlay
                paddedOverlay
                children={t('buttons.submit', 'Submit')}
                />

              <p>{t('or', 'Or...')}</p>

              <a
                onClick={this.onChangePassword}
                className="btn btn-default"
                href="/change_password"
                children={t('buttons.enter_password_reset_code', 'Enter code to change password')} />
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

      e.preventDefault();

      saveButton.markLoading();
      this.clearFormError();

      this.sendAction('users:resetPassword', {
        email: this.state.email
      }).then(function() {
        saveButton.markDone(true);
      }, function(error) {
        if (error.code === 'not_found') {
          showFormError({
            fieldErrors: {
              email: {
                message: t('errors.not_found', 'No user was found registered to that email address.')
              }
            }
          });
        }

        saveButton.markDone(false);
      });
    }
  });

  return ResetPasswordDialog;
});