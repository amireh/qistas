/** @jsx React.DOM */
define([
  'ext/react',
  'i18n!dialogs/login',
  'jsx!components/dialog',
  'jsx!./_oauth_links',
  'jsx!components/save_button',
], function(React, t, Dialog, OauthLinks, SaveButton) {
  var LoginDialog = React.createClass({
    mixins: [
      React.addons.LinkedStateMixin,
      React.addons.FormErrorsMixin,
      React.addons.ActorMixin
    ],

    getInitialState: function() {
      return {
        email: null,
        password: null
      };
    },

    onStoreError: function() {
      this.refs.saveButton.markDone(false);
      this.showFormError({
        fieldErrors: {
          email: {
            code: 'BAD_CREDENTIALS',
            message: 'The email or password you entered were incorrect.'
          }
        }
      });
    },

    render: function() {
      return(
        <Dialog
          onClose={this.props.onClose}
          title={t('title', 'Sign in to Pibi')}
          autoFocus='[name="email"]'
          thin={true}>
          <i className="icon-pibi-framed icon-64"> </i>

          <p>{t('use_existing_account', 'Use an existing account.')}</p>

          <OauthLinks />

          <hr />

          <p>{t('use_account', 'Or, use your Pibi account.')}</p>

          <form ref="form" onSubmit={this.login} noValidate className="vertical-form">
            <input
              type="email"
              name="email"
              ref="email"
              placeholder={t('placeholders.email', 'Email')}
              autoFocus
              className="form-input" />

            <input
              type="password"
              name="password"
              ref="password"
              placeholder={t('placeholders.password', 'Password')}
              className="form-input" />

            <SaveButton ref="saveButton" onClick={this.login}
              className="primary" overlay={true} paddedOverlay={true}>
              {t('buttons.login', 'Log In')}
            </SaveButton>
          </form>

          <hr />

          <nav>
            <p>
              {t.htmlSafe('links.link_to_signup',
                'Don\'t have an account? <a href="/signup">Sign up</a>')
              }

              <br />

              <em className="type-small">
                {t.htmlSafe('links.to_reset_password',
                  "Forgot your password? <a href=\"/reset_password\">Reset it</a>")
                }
              </em>
            </p>
          </nav>
        </Dialog>
      );
    },

    login: function(e) {
      var service;

      e.preventDefault();

      this.refs.saveButton.markLoading();
      this.sendAction('session:login', {
        email: this.refs.email.getDOMNode().value,
        password: this.refs.password.getDOMNode().value
      });
    }
  });

  return LoginDialog;
});