/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!navigation');
  var Places = require('jsx!./navigation/places');
  var LocalePicker = require('jsx!./statusbar/locale_picker');

  var Navigation = React.createClass({
    getDefaultProps: function() {
      return {
      };
    },

    render: function() {
      return(
        <nav id="navbar" className="navbar">
          <Places
            active={this.props.active}
            activeChild={this.props.activeChild} />
        </nav>
      );
    }
  });

  return Navigation;
});