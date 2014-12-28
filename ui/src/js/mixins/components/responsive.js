define(function(require) {
  var InflectionJS = require('inflection');
  var K = require('constants');

  var getPlatformMethod = function(component, method, platform) {
    var platformMethod = [ method, platform ].join('_').camelize(true);
    return component[platformMethod];
  };

  var getRenderer = function(component, platform) {
    if (!platform) {
      return component.__render__;
    }

    return getPlatformMethod(component, 'render', platform) || component.__render__;
  };

  /**
   * @class Mixins.Components.Responsive
   *
   * Provides your host component with the ability to render different things
   * based on the browser's platform: mobile, tablet, or desktop.
   *
   * The host component is expected to receive a "platform" prop for this mixin
   * to have effect.
   *
   * == Usage
   *
   * For each platform you support, define a specific render method suffixed
   * by the name of the platform. For example, for the "mobile" platform:
   *
   *     renderMobile: function() {
   *       return <div />;
   *     }
   *
   * For platforms that do not have a custom renderer, the default "render" will
   * be used:
   *
   *     // called on any other platform other than "mobile"
   *     render: function() {
   *       return <span />;
   *     }
   */
  var ResponsiveMixin = {
    componentWillMount: function() {
      this.__render__ = this.render;
      this.render = getRenderer(this, this.props.platform);
    },

    componentWillReceiveProps: function(nextProps) {
      var teardown;

      if (nextProps.platform !== this.props.platform) {
        this.__needsSetupForPlatform = true;
        this.render = getRenderer(this, nextProps.platform);
        teardown = getPlatformMethod(this, 'teardown', this.props.platform);

        if (teardown) {
          teardown();
        }
      }
    },

    componentDidMount: function() {
      this.__needsSetupForPlatform = true;
    },

    componentDidUpdate: function() {
      var setup;

      if (this.__needsSetupForPlatform) {
        this.__needsSetupForPlatform = false;
        setup = getPlatformMethod(this, 'setup', this.props.platform);

        if (setup) {
          setup();
        }
      }
    },

    componentWillUnmount: function() {
      var teardown;

      this.render = this.__render__;
      delete this.__render__;

      teardown = getPlatformMethod(this, 'teardown', this.props.platform);

      if (teardown) {
        teardown();
      }
    },
  };

  return ResponsiveMixin;
});