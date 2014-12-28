/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var MainMenu = require('jsx!./statusbar/main_menu');

  var StatusBar = React.createClass({
    mixins: [ React.addons.ResponsiveMixin ],

    getDefaultProps: function() {
      return {
        name: undefined,
        email: undefined,
        activeTheme: undefined,
        actionCenter: [],
        realtime: undefined
      };
    },

    render: function() {
      return(
        <header id="statusbar" className="statusbar">
          <MainMenu
            realtime={this.props.realtime}
            backlog={this.props.backlog}
            name={this.props.name}
            email={this.props.email} />
        </header>
      );
    },

    renderMobile: function() {
      return <header id="statusbar" />;
    }
  });

  return StatusBar;
});