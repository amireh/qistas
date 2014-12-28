/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var Dropdown = require('jsx!components/dropdown');
  var Button = require('jsx!components/button');
  var t = require('i18n!backlog');

  var DropdownToggle = Dropdown.Toggle;
  var DropdownMenu = Dropdown.Menu;
  var classSet = React.addons.classSet;

  var Backlog = React.createClass({
    mixins: [ React.addons.ActorMixin ],

    getDefaultProps: function() {
      return {
        realtime: {
          online: false,
          connecting: false,
          disconnecting: false
        },
        backlog: {}
      };
    },

    render: function() {
      var pendingCount = this.props.backlog.pendingCount || 0;
      var className = classSet({
        'inline': true,
        'has-pending': pendingCount > 0,
        'online': this.props.realtime.online,
        'offline': !this.props.realtime.online,
      });

      return(
        <div className={className} id="backlog">
          <Dropdown textual sticky>
            <DropdownToggle className="statusbar-btn">
              <i className="icon-cloud2 icon-16 status-indicator" />

              {pendingCount > 0 &&
                <span className="pending-count">{pendingCount}</span>
              }
            </DropdownToggle>

            <DropdownMenu className="text-left pull-right">
              <header className="title">{t('title', 'Pibi Cloud')}</header>

              <div className="dropdown-item">
                {this.props.realtime.online ?
                  t('online_message', 'You are connected to the Pibi Cloud.') :
                  t.htmlSafe('offline_message',
                    'You seem to be disconnected. ' +
                    'Your actions will be synchronized once you come back online.')
                }

                {!this.props.realtime.online &&
                  <p onClick={this.reconnect}>
                    {this.props.realtime.connecting ?
                      t.htmlSafe('actions.reconnecting', 'Reconnecting...') :
                      t.htmlSafe('actions.reconnect', 'Click <a>here</a> to reconnect.')
                    }
                  </p>
                }
              </div>

              <div className="dropdown-item"><hr /></div>

              {pendingCount > 0 && this.renderPendingEntries()}

              <div className="dropdown-item">
                <Button type="link"onClick={this.showJournal}>
                  {t('buttons.open_journal', 'Open Journal')}
                </Button>
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    },

    renderPendingEntries: function() {
      var pendingCount = this.props.backlog.pendingCount || 0;

      return [
        <div className="dropdown-item">
          {t('pending_message', {
            defaultValue: 'You have __count__ actions awaiting to be synced.',
            count: pendingCount
          })}

          <p onClick={this.commit}>
            {t.htmlSafe('inspection_message',
              'You can choose to <a>sync</a> them now.')}
          </p>
        </div>
      ];
    },

    commit: function(e) {
      e.preventDefault();

      this.sendAction('backlog:commit');
    },

    reconnect: function(e) {
      e.preventDefault();

      if (e.target.tagName !== 'A') {
        return;
      }
      else if (this.props.realtime.connecting || this.props.realtime.disconnecting) {
        return;
      }
      else {
        this.sendAction('realtime:reconnect');
      }
    },

    showJournal: function(e) {
      e.preventDefault();
      this.sendAction('backlog:showJournal');
    }
  });

  return Backlog;
});