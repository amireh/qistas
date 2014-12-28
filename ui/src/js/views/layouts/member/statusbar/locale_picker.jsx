/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Config = require('config');
  var locale = require('config/initializers/locale');
  var Dropdown = require('jsx!components/dropdown');
  var DropdownToggle = Dropdown.Toggle;
  var DropdownMenu = Dropdown.Menu;

  var LocalePicker = React.createClass({
    getDefaultProps: function() {
      return {
        locale: locale,
        locales: Config.availableLocales
      };
    },
    render: function() {
      return(
        <Dropdown invisibilityFix id="locale_picker" className="inline">
          <DropdownToggle className="statusbar-btn">
            <i className="icon-16 icon-earth"></i>
            <span>{Config.localeNames[this.props.locale]}</span>
          </DropdownToggle>

          <DropdownMenu tagName="menu">
            {this.props.locales.map(this.renderLocale)}
          </DropdownMenu>
        </Dropdown>
      );
    },

    renderLocale: function(locale) {
      return (
        <a
          key={locale}
          className="dropdown-item"
          href="#"
          onClick={this.changeLocale.bind(null, locale)}>
          {Config.localeNames[locale]}
        </a>
      );
    },

    changeLocale: function(localeISO) {
      if (localeISO !== locale) {
        window.location.href = location.pathname.replace(locale, localeISO);
      }

      return false;
    }
  });

  return LocalePicker;
});