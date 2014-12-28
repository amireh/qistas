/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Users = require('stores/users');
  var Notifier = require('modules/notifier');
  var K = require('constants');
  var t = require('i18n!notifications');
  var Actions = require('actions/notifications');

  var Notifications = React.createClass({
    getDefaultProps: function() {
      return {
        notifications: []
      };
    },

    componentDidMount: function() {
      Users.on('actionSuccess', this.notifySuccess);
    },

    render: function() {
      return(
        <ul aria-relevant="additions" aria-live="assertive" id="notifications">
          {this.props.updateAvailable && this.renderUpdateAvailable()}
          {this.props.notifications.map(this.renderNotification)}
        </ul>
      );
    },

    renderNotification: function(notification) {
      var renderer = notification.view;

      return (
        <li key={notification.id}>
          <div className="notification">
            {renderer ? renderer(notification.context) : notification.code}
          </div>

          <a
            className="dismiss-notification"
            href="#"
            onClick={this.dismiss.bind(null, notification.id)}>
            {t('dismiss_notification', 'Dismiss')}
          </a>
        </li>
      );
    },

    dismiss: function(id, e) {
      e.preventDefault();

      Actions.dismiss(id);
    },

    notifySuccess: function(action, actionIndex) {
      var message;

      switch(action) {
        case 'users:resetPassword':
          message = t('password_reset.sent', {
            defaultValue: 'Further instructions were sent to your email.' +
                          'Please check your inbox shortly.',
            email: Users.getEmail()
          });
        break;
      }

      if (message) {
        Notifier.success(message);
      }
    },

    notifyError: function(action, actionIndex, error) {
      var message;

      switch(action) {
        case 'users:resetPassword':
          if (error.code === 'not_found') {
            message = t('password_reset.bad_email', {
              defaultValue: 'That email is not registered to any Pibi account.'
            });
          }
          else {
            message = t('password_reset.unexpected_error', {
              defaultValue: 'Unable to request a password reset. Please try again later.'
            });
          }
        break;
      }

      if (message) {
        Notifier.error(message);
      }
    },

    renderUpdateAvailable: function() {
      return (
        <p className="notification">
          A newer version of the application is available.
          {' '}
          <a href="#" onClick={this.reloadPage}>Refresh</a> the page to get
          new goodies and fixes. :)
        </p>
      );
    },

    reloadPage: function() {
      window.location.reload();
    }
  });

  return Notifications;
});