/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var Dialog = require('jsx!components/dialog');
  var SaveButton = require('jsx!components/save_button');
  var OauthLinks = require('jsx!./_oauth_links');
  var t = require('i18n!dialogs/signup');
  var Actions = require('../actions');

  var SignupDialog = React.createClass({
    mixins: [
      React.addons.LinkedStateMixin,
      React.addons.FormErrorsMixin,
      React.addons.ActorMixin
    ],

    getInitialState: function() {
      return {
        email: null,
        password: null,
        subscribe: null
      };
    },

    onStoreError: function() {
      this.refs.saveButton.markDone(false);
    },

    render: function() {
      return(
        <Dialog
          onClose={this.props.onClose}
          title={t('title', 'Sign up to Salati')}
          autoFocus='[name="name"]'
          className="signup-dialog"
          scrollable={false}
          thin>

          <form ref="form" onSubmit={this.signup} noValidate className="vertical-form">
            <p>{t('signup_intro', 'All you need to get started is to provide an email and a password for your new account.')}</p>
            <input
              type="text"
              name="name"
              placeholder={t('placeholders.name', 'Your name')}
              valueLink={this.linkState('name')}
              className="form-input" />

            <input
              type="email"
              name="email"
              placeholder={t('placeholders.email', 'Your email')}
              valueLink={this.linkState('email')}
              className="form-input" />

            <input
              type="password"
              name="password"
              placeholder={t('placeholders.password', 'A password')}
              valueLink={this.linkState('password')}
              className="form-input" />

            <SaveButton
              ref="saveButton"
              onClick={this.signup}
              className="primary"
              overlay={true}
              paddedOverlay={true}
              children={t('buttons.signup', 'Sign Up')} />
          </form>
        </Dialog>
      );
    },

    signup: function(e) {
      var action;

      e.preventDefault();

      this.clearFormError();

      action = Actions.signup({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        subscribe: this.state.subscribe
      });

      this.trackAction(action);
    }
  });

  return SignupDialog;
});