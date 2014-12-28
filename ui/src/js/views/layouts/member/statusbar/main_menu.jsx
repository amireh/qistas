/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var Dropdown = require('jsx!components/dropdown');
  var t = require('i18n!statusbar/main_menu');
  var md5 = require('md5');

  var gravatarHash = function(email) {
    return md5((email || '').trim().toLowerCase());
  };

  var DropdownToggle = Dropdown.Toggle;
  var DropdownMenu = Dropdown.Menu;
  var MainMenu = React.createClass({
    mixins: [ React.addons.ActorMixin ],
    getDefaultProps: function() {
      return {
        name: 'Member',
        email: 'demo@pibiapp.com'
      };
    },

    render: function() {
      var gravatarDim = "32";
      var email = this.props.email;
      var gravatarUrl = "https://gravatar.com/avatar/" + gravatarHash(email) + ".png?s=" + gravatarDim;
      var firstName = this.props.name.split(/\s/)[0];

      return(
        <div className="inline" id="MainMenu">
          <Dropdown sticky withCaret={false} invisibilityFix>
            <DropdownToggle className="statusbar-btn">
              <span className="MainMenu_Gravatar">
                <img
                  alt={email}
                  title={email}
                  height={gravatarDim}
                  width={gravatarDim}
                  src={gravatarUrl}
                  />
              </span>

              {' '}
              <strong className="MainMenu_FirstName">{firstName}</strong>
            </DropdownToggle>

            <DropdownMenu tagName="ul">
              <li id="statusbar_user_name" className="title">{this.props.name} </li>

              <li className="divider"></li>

              <li>
                <a href="/settings" className="dropdown-item">
                  {t('settings', 'Settings')}
                </a>
              </li>

              <li>
                <a href="/keyboard" className="dropdown-item visible-desktop">
                  {t('keyboard_shortcuts', 'Keyboard Shortcuts')}
                </a>
              </li>

              <li>
                <a disabled href="/changelog" className="dropdown-item">
                  {t('changelog', 'Changelog')}
                </a>
              </li>

              <li className="divider"></li>

              <li>
                <a
                  disabled
                  className="dropdown-item icon-rotate embedded-icon-16">
                  {t('undo', 'Undo')}
                </a>
              </li>

              <li className="divider"></li>

              <li>
                <a
                  data-online="disable"
                  onClick={this.logout}
                  className="dropdown-item icon-switch embedded-icon-16">
                  {t('logout', 'Logout')}
                </a>
              </li>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    },

    logout: function(e) {
      e.preventDefault();

      this.sendAction('session:logout');
    }
  });

  return MainMenu;
});