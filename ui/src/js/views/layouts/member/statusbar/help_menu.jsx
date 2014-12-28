/** @jsx React.DOM */
define([ 'react', 'i18n!statusbar/help_menu', 'jsx!components/dropdown' ],
function(React, t, Dropdown) {
  var DropdownToggle = Dropdown.Toggle;
  var DropdownMenu = Dropdown.Menu;

  var HelpMenu = React.createClass({
    render: function() {
      return(
        <Dropdown invisibilityFix id="help_menu" className="inline">
          <DropdownToggle className="statusbar-btn">
            <i className="icon-16 icon-question"></i>
          </DropdownToggle>

          <DropdownMenu tagName="ul">
            <li>
              <a className="dropdown-item" href="http://support.pibiapp.com" target="_blank">
                {t('support_center', 'Support Center')}
              </a>
            </li>
            <li>
              <a className="dropdown-item">
                {t('live_chat', 'Live Chat')}
              </a>
            </li>
          </DropdownMenu>
        </Dropdown>
      );
    }
  });

  return HelpMenu;
});