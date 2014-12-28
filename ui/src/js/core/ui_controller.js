define(function(require) {
  var Pixy = require('pixy');
  var Promise = require('core/promise');
  var React = require('react');
  var AppLayout = require('jsx!views/layouts/app');
  var $ = require('jquery');
  var K = require('constants');

  var layout;

  /**
   * @internal {Promise} applicationLayout
   *
   * The AppLayout once it's been mounted.
   */
  var applicationLayout = Promise.defer();
  var ready = function() {
    return applicationLayout.promise;
  };

  var UIController = Pixy.Object.extend({
    name: 'UIController',

    start: function() {
      if (!layout) {
        layout = React.renderComponent(AppLayout(), $('<div />').appendTo('#app')[0]);

        $('#loading_screen').remove();

        applicationLayout.resolve(layout);
      }

      return applicationLayout.promise;
    },

    hasStarted: function() {
      return !!layout;
    },

    /**
     * Render a component into a layout region.
     *
     * @param {React.Class} component
     *
     * @param {Object} options
     *
     * @param {String} [options.into="main"]
     *        The region to mount the component in.
     *
     * @param {String} [options.outlet="content"]
     *        The region outlet to mount the component in.
     */
    render: function(component, layoutName, options) {
      options = options || {};

      console.warn('Using singular #render, this is not efficient.');

      ready().then(function(layout) {
        try {
          layout.add(component, layoutName, options).then(function() {
            layout.resetScroll();
          });
        } catch(e) {
          console.warn('Failed to update layout props:');
          console.warn(e, e.stack);

          // TODO: inject the error and present it somehow
        }
      });
    },

    renderMany: function(specs) {
      return new Promise(function(resolve, reject) {
        if (!specs.length) {
          return resolve();
        }

        ready().then(function(layout) {
          layout.addMany(specs).then(function() {
            var hasPrimaryView = specs.some(function(spec) {
              return spec.layoutName !== K.LAYOUT_DIALOGS;
            });

            if (hasPrimaryView) {
              layout.resetScroll();
            }

            resolve();
          }, reject);
        });
      });
    },

    collapseDrawer: function() {
      ready().then(function(layout) {
        layout.collapseDrawer();
      });
    },

    update: function(props) {
      if (Object.keys(props).length === 0) {
        console.warn('Attempting to update layout with no changes:', props);
        return;
      }

      return ready().then(function(layout) {
        layout.setProps(props);
      });
    },

    /**
     * Remove a previously-rendered component from the layout.
     *
     * @param {React.Class} component
     *
     * @param {Object} options
     *
     * @param {String} [options.from="main"]
     *        The region you mounted the component in. Not specifying the
     *        correct region will cause an error to be thrown.
     *
     */
    remove: function(component, layoutName, options) {
      options = options || {};

      ready().then(function(layout) {
        layout.remove(component, layoutName, options);
      });
    },

    setLoadingState: function(isOn) {
      return this.update({
        loading: !!isOn
      });
    },

    setTransitioningState: function(isOn) {
      return this.update({
        transitioning: !!isOn
      });
    }
  });

  return new UIController();
});