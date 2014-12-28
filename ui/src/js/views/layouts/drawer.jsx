/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var RouteActions = require('actions/routes');
  var Navigation = require('jsx!./member/navigation_mobile');
  var t = require('i18n!navigation');

  var Drawer = React.createClass({
    mixins: [
      React.addons.StackedLayoutMixin,
      React.addons.ActorMixin
    ],

    getDefaultProps: function() {
      return {
      };
    },

    render: function() {
      var hasNavigation = !!this.getNextComponentType();

      return(
        <div className="snap-drawers" onClick={this.propagateCollapse}>
          <div className="snap-drawer snap-drawer-left">
            {hasNavigation ? this.renderAttached() : this.renderPrimaryNavigation()}
          </div>
        </div>
      );
    },

    renderAttached: function() {
      return (
        <div>
          {this.renderComponent()}

          <button
            key="backButton"
            className="btn-a11y drawer-link"
            onClick={this.detach}>
            {t('back', 'Back')}
          </button>
        </div>
      )
    },

    renderPrimaryNavigation: function() {
      return (
        <Navigation
          key="drawer"
          active={this.props.navbar.item}
          activeChild={this.props.navbar.child}
          platform={this.props.platform}
          user={this.props.user} />
      );
    },

    propagateCollapse: function(e) {
      if (e.target.className.match('navbar-link')) {
        this.props.onClick();
      }
    },

    detach: function() {
      RouteActions.backToPrimaryView();
    }
  });

  Drawer.ToggleButton = React.createClass({
    render: function() {
      return (
        <button
          id="toggle_drawer"
          className="btn-a11y"
          onClick={this.props.onClick}
          children={<i className="icon-menu3" />} />
      );
    }
  })

  return Drawer;
});