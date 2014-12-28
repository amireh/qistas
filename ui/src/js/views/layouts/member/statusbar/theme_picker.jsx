/** @jsx React.DOM */
define([
  'ext/react',
  'i18n!statusbar/theme_picker',
  'jsx!components/dropdown',
  'constants',
  'json!config/themes',
],
function(React, t, Dropdown, K, AVAILABLE_THEMES) {
  var DropdownToggle = Dropdown.Toggle;
  var DropdownMenu = Dropdown.Menu;
  var classSet = React.addons.classSet;
  var body = document.body;
  var THEME_EXTRACTOR = /theme-([^\s])+/g;
  var THEME_CLASS_PREFIX = 'theme-';

  var thumbnailUrl = function(theme) {
    return K.THEME_THUMBNAILS_BASE_URL + '/' + theme;
  };

  var setTheme = function(theme) {
    body.className = body.className
      .replace(THEME_EXTRACTOR, '')
      .split(' ')
      .concat(THEME_CLASS_PREFIX + theme).join(' ');
  };

  var ThemePicker = React.createClass({
    mixins: [ React.addons.ActorMixin ],

    getDefaultProps: function() {
      return {
        activeTheme: 'vanilla',
        themes: AVAILABLE_THEMES
      };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      return nextProps.activeTheme !== this.props.activeTheme;
    },

    componentDidUpdate: function(prevProps, prevState) {
      setTheme(this.props.activeTheme);
    },

    componentDidMount: function() {
      setTheme(this.props.activeTheme);
    },

    render: function() {
      return(
        <Dropdown id="theme_picker" className="inline" sticky={true}>
          <DropdownToggle className="statusbar-btn">
            <span className="active-theme theme-thumbnail">
              <img src={thumbnailUrl(this.props.activeTheme)} />
            </span>
          </DropdownToggle>

          <DropdownMenu tagName="ul" className="unstyled margined">
            {this.props.themes.map(this.renderTheme)}
          </DropdownMenu>
        </Dropdown>
      );
    },

    renderTheme: function(theme) {
      var className = { 'theme-thumbnail': true };
      className['theme-thumbnail-' + theme] = true;

      return (
        <li key={'theme-' + theme}
          onClick={this.changeTheme.bind(null, theme)}
          className={this.props.activeTheme === theme ? 'active' : undefined}>
          <i className={classSet(className)} />
        </li>
      );
    },

    changeTheme: function(theme) {
      this.sendAction('users:setTheme', theme);
    }
  });

  return ThemePicker;
});