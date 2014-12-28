/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var Dropdown = require('jsx!components/dropdown');
  var t = require('i18n!notification_center');

  var DropdownToggle = Dropdown.Toggle;
  var DropdownMenu = Dropdown.Menu;
  var classSet = React.addons.classSet;

  var ActionCenter = React.createClass({
    mixins: [ React.addons.ActorMixin ],

    getDefaultProps: function() {
      return {
        notifications: []
      };
    },

    render: function() {
      var unread = this.props.notifications.filter(function(message) {
        return message.unread;
      });

      var read = this.props.notifications.filter(function(message) {
        return !message.unread;
      });

      var className = classSet({
        'inline': true,
        'has-unread': unread.length > 0
      });

      return(
        <div className={className} id="notification_center">
          <Dropdown textual sticky onClose={this.markAllRead}>
            <DropdownToggle className="statusbar-btn">
              <i className="icon-bubble2 icon-16" />

              {unread.length > 0 &&
                <span className="unread-count">{unread.length}</span>
              }
            </DropdownToggle>

            <DropdownMenu tagName="ul" className="text-left pull-right">
              {this.renderUnreadNotifications(unread)}
              {read.length > 0 && this.renderReadNotifications(read)}
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    },

    renderUnreadNotifications: function(notifications) {
      return (
        <div>
          <li className="title">
            {t('unread_title', 'Latest notifications')}
          </li>

          {notifications.length === 0 &&
            <li className="dropdown-item">
              {t('no_unread', 'You have no unread notifications.')}
            </li>
          }

          {notifications.map(this.renderNotification)}
        </div>
      );
    },

    renderReadNotifications: function(notifications) {
      return (
        <div>
          <li key="title" className="title"><hr /></li>
          {notifications.map(this.renderNotification)}
        </div>
      );
    },

    renderNotification: function(notification) {
      var statusClassName = classSet({
        'notification-status': true,
        'success': notification.success,
        'error': !notification.success
      });

      return (
        <li key={'n-'+notification.id} className="dropdown-item notification">
          <span className={statusClassName}>
            {notification.success ?
              <i className="icon-checkmark" /> :
              <i className="icon-close" />
            }
          </span>

          <div className="notification-message inline">
            {notification.message}
          </div>
        </li>
      );
    },

    markAllRead: function() {
      this.sendAction('actionCenter:markAllRead');
    }
  });

  return ActionCenter;
});