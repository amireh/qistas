/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!guest/index');
  var Environment = require('core/environment');
  var TransactionListing = require('jsx!components/transaction_listing');
  var SaveButton = require('jsx!components/save_button');

  var GuestIndex = React.createClass({
    mixins: [
      React.addons.LinkedStateMixin,
      React.addons.FormErrorsMixin,
      React.addons.ActorMixin
    ],

    render: function() {
      var isMobile = this.props.platform === 'mobile';
      var logo = <div className="header-logo">
        <i className="icon-pibi-framed flip-in-y"></i>
      </div>;

      return(
        <div id="landing" className="row-fluid">
          <section className="container greeting hero-unit">
            <h1>
              {t('welcome', 'Salati')}
            </h1>

            <h2 className="landing-meme">
              <strong>
                {t('motto', 'Plan for a better (after)life.')}
              </strong>
            </h2>

            <form
              ref="form"
              onSubmit={this.login}
              noValidate
              className="PrimaryLoginForm vertical-form">

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
              </p>

              <p className="ForgotPasswordLink">
                <em className="type-small">
                  {t.htmlSafe('links.to_reset_password',
                    "Forgot your password? <a href=\"/reset_password\">Reset it</a>")
                  }
                </em>
              </p>
            </nav>
          </section>
        </div>
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

  return GuestIndex;
});