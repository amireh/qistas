/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var DialogLayout = require('jsx!./dialog');
  var GuestLayout = require('jsx!./guest');
  var MemberLayout = require('jsx!./member');
  var LoadingScreen = require('jsx!../loading_screen');
  var Logger = require('util/debug_log');
  var Drawer = require('jsx!./drawer');
  var Snap = require('snap');
  var $ = require('jquery');
  var K = require('constants');
  var log = Logger('AppLayout');
  var DRAWER_DIRECTION = 'left';
  var $content;

  function getChildLayout(props) {
    return props.authenticated ? MemberLayout : GuestLayout;
  }

  var AppLayout = React.createClass({
    mixins: [
      React.addons.LayoutManagerMixin,
      React.addons.ErrorNotifierMixin,
      React.addons.ResponsiveMixin,
    ],

    statics: {
      getLayout: function(name, props/*, state*/) {
        if (name === K.LAYOUT_DIALOGS) {
          return DialogLayout;
        }
        else if (name === K.LAYOUT_GUEST) {
          return GuestLayout;
        }
        else if (name === K.LAYOUT_MAIN) {
          return MemberLayout;
        }
        else if (name === K.LAYOUT_DRAWER) {
          return Drawer;
        }
        else {
          return getChildLayout(props);
        }
      }
    },

    getInitialState: function() {
      return {
        childLayout: getChildLayout(this.props)
      };
    },

    getDefaultProps: function() {
      return {
        authenticated: false,
        transitioning: false,
        navbar: {},
        user: {}
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var prop, childLayout;

      //>>excludeStart("production", pragmas.production);
      /* global DEBUG: false */
      // log('new props:', DEBUG.diff(this.props, nextProps));
      //>>excludeEnd("production");

      // Remove "unset" props (ones that are undefined) completely
      for (prop in nextProps) {
        if (nextProps.hasOwnProperty(prop) && nextProps[prop] === undefined) {
          delete nextProps[prop];
        }
      }

      // Change the layout if authentication status has changed.
      if (this.props.authenticated !== nextProps.authenticated) {
        console.info('Authentication status has changed:',
          nextProps.authenticated);

        childLayout = getChildLayout(this.props);

        if (childLayout) {
          this.clearLayout(getChildLayout(this.props));
        }

        this.setState({
          childLayout: getChildLayout(nextProps)
        });
      }
    },

    componentDidUpdate: function() {
      // If a store error is present, remove it after the first pass of #render
      // in which the error was set.
      //
      // This is so that the error won't stick around, and if any child wanted
      // to handle it, it would have done so in the last render pass.
      if (this.props.storeError) {
        this.setProps({
          storeError: undefined
        });
      }

      if (this.props.platform === 'mobile') {
        if (this.props.authenticated) {
          this.snapper.enable();
        } else {
          this.snapper.disable();
        }
      }

      $(document.body).toggleClass('member', this.props.authenticated);
      $(document.body).toggleClass('guest', !this.props.authenticated);
    },

    // Use Snap.js on mobile to simulate "drawer" functionality:
    setupMobile: function() {
      this.snapper = new Snap({
        element: this.refs.snapContent.getDOMNode(),
        disable: 'right'
      });
    },

    teardownMobile: function() {
      this.snapper = undefined;
    },

    render: function() {
      log('rendering...');

      return (
        <div>
          {this.renderLayout(DialogLayout, { key: 'dialogLayout' })}

          <div id="main" key="main">
            {this.renderLayout(this.state.childLayout, { key: 'childLayout' })}
          </div>

          <div id="humane_notifications" key="humane" />
        </div>
      );
    },

    /**
     * Key mobile differences:
     *
     *   - dialog and content layouts are mutually exclusive
     *   - a drawer is displayed when the user is authenticated
     *   - a button that toggles the drawer is always there
     */
    renderMobile: function() {
      var hasDialog = !DialogLayout.isEmpty(null, this.state);
      var isAuthenticated = this.props.authenticated;
      var isTransitioning = this.props.transitioning;
      var hasPopup = !!this.props.activePopupId;
      var className = React.addons.classSet({
        'with-popup': hasPopup
      });

      log('rendering (mobile)...');

      return (
        <div className={className}>
          {isAuthenticated &&
            this.renderLayout(Drawer, {
              key: 'drawerLayout',
              onClick: this.collapseDrawer
            })
          }

          <div className="snap-content" ref="snapContent">
            {isAuthenticated && Drawer.ToggleButton({ onClick: this.toggleDrawer })}
            <div id="overlay_popups" />

            {hasDialog && this.renderLayout(DialogLayout, { key: 'dialogLayout' })}
            {!hasDialog && this.renderLayout(this.state.childLayout, { key: 'childLayout' })}
          </div>

          {isTransitioning && <LoadingScreen />}

          <div id="notifications"></div>
        </div>
      );
    },

    toggleDrawer: function() {
      var state = this.snapper.state();

      if (state.state === 'closed') {
        this.snapper.open(DRAWER_DIRECTION);
      } else {
        this.snapper.close(DRAWER_DIRECTION);
      }
    },

    collapseDrawer: function(e) {
      this.snapper.close(DRAWER_DIRECTION);
    },

    resetScroll: function() {
      if (!$content) {
        $content = $(window);
      }

      $content.scrollTop(0);
    }
  });

  return AppLayout;
});