define(function(require) {
  var Pixy = require('ext/pixy');
  var _ = require('underscore');
  var Constants = require('constants');
  var moment = require('moment');
  var Config = require('config');
  var Env = require('core/environment');
  var noop = require('util/noop');

  var API_DATE_FORMAT = Config.apiDateFormat;
  var store;
  var primaryRoute;
  var previousPrimaryRoute;
  var secondaryRoute;
  var clone = _.clone;
  var dateRange = {
    from: null,
    to: null
  };

  /**
   * @internal
   * The current route and its layer.
   */
  var currentRouteInfo = {
    route: null,
    layer: null
  };

  /**
   * @internal
   * The previous route and its layer.
   */
  var previousRouteInfo = clone(currentRouteInfo);

  /**
   * Set a new route to the current one.
   *
   * @param {Object} payload
   *
   * @param {String} payload.layer (required)
   *        Either APP_PRIMARY_LAYER or APP_SECONDARY_LAYER.
   *
   * @param {String} payload.route (required)
   *        The route.
   */
  function trackRouteChanges(payload, onChange) {
    console.debug('Route change:', payload.route, '[', payload.layer, ']');

    previousRouteInfo = clone(currentRouteInfo);

    currentRouteInfo = {
      route: payload.route,
      layer: payload.layer
    };

    if (payload.layer === Constants.APP_PRIMARY_LAYER) {
      previousPrimaryRoute = primaryRoute;
      primaryRoute = payload.route;
    }
    else if (payload.layer === Constants.APP_SECONDARY_LAYER) {
      secondaryRoute = payload.route;
    }

    // onChange();
  }

  /**
   * Update the date-range that affects the resources loaded.
   *
   * @param {Object} payload  [description]
   *
   * @param {String} payload.from (required)
   * @param {String} payload.to (required)
   * @param {String} payload.format
   */
  function setDateRange(payload, onChange, onError) {
    var from, to, valid;

    if (!dateRange) {
      dateRange = {};
    }

    if (payload.from) {
      from = moment(payload.from, API_DATE_FORMAT);
    }
    else {
      from = moment().startOf('month');
    }

    if (payload.to) {
      to = moment(payload.to, API_DATE_FORMAT);
    }
    else {
      to = moment().endOf('month');
    }

    valid = to.isSame(from) || to.isAfter(from);

    if (!valid) {
      Env.removeQueryParameters(['from', 'to']);
      return onError();
    }

    if (dateRange.from && dateRange.to) {
      if (from.isSame(dateRange.from) && to.isSame(dateRange.to)) {
        return;
      }
    }

    dateRange.from = from;
    dateRange.to = to;

    onChange();
  }

  /**
   * @class Stores.App
   *
   * Storage for app-wide state like the route history.
   */
  store = new Pixy.Store('app', {
    initialize: function() {
      var query = Env.query;

      this.checkForUpdates();

      if (Config.updatePollingFrequency) {
        this.regularlyCheckForUpdates(Config.updatePollingFrequency);
      }

      // parse "from" and "to" from query string, otherwise use the defaults:
      setDateRange({
        from: query.from,
        to: query.to
      }, noop, noop);
    },

    getInitialState: function() {
      return {
        updateAvailable: false
      };
    },

    /**
     * The current route.
     *
     * @return {Object} routeInfo
     * @return {String} routeInfo.route
     *         The URL.
     * @return {String} routeInfo.layer
     *         The layer in which the route's view resides.
     */
    currentRouteInfo: function() {
      return currentRouteInfo;
    },

    /**
     * Like #currentRouteInfo but for the immediate previous route.
     */
    previousRouteInfo: function() {
      return previousRouteInfo;
    },

    /**
     * @return {String}
     *         URL of the route currently occupying the primary layer.
     */
    currentPrimaryRoute: function() {
      return primaryRoute;
    },

    /**
     * @return {String}
     *         URL of the last route that occupied the primary layer.
     */
    previousPrimaryRoute: function() {
      return previousPrimaryRoute;
    },

    /**
     * @return {String}
     *         URL of the current route occupying the secondary layer, e.g, a
     *         dialog route.
     */
    currentSecondaryRoute: function() {
      return secondaryRoute;
    },

    isUpdateAvailable: function() {
      return !!this.state.updateAvailable;
    },

    dateRange: function() {
      return {
        from: dateRange.from.format(API_DATE_FORMAT),
        to: dateRange.to.format(API_DATE_FORMAT)
      };
    },

    actions: {
      trackRoute: function(payload, onChange, onError) {
        trackRouteChanges(payload, onChange);
      },

      setDateRange: function(payload, onChange, onError) {
        setDateRange(payload, function() {
          this.trigger('change:dateRange', dateRange);

          Env.updateQueryString({
            from: dateRange.from.format(API_DATE_FORMAT),
            to: dateRange.to.format(API_DATE_FORMAT)
          });

          onChange();
        }.bind(this), onError);
      }
    },

    checkForUpdates: function() {
      var appCache = window.applicationCache;
      var that = this;
      var onUpdateAvailable = function() {
        console.info('An application update is available and has been installed.');
        console.info('\tSwapping cache...');

        try {
          appCache.swapCache();
        }
        catch (e) {
          console.warn('Application cache could not be swapped:', e);
          console.warn('Resuming operation.');
        }
        finally {
          this.setState({ updateAvailable: true });
          this.emitChange();

          console.info('Updated.');
        }
      }.bind(this);

      // Check if a new cache is available on page load.
      if (appCache) {
        if (appCache.status == appCache.UPDATEREADY) {
          onUpdateAvailable();
        }
        //>>excludeStart("production", pragmas.production);
        else if (localStorage.simulatingUpdate) {
          onUpdateAvailable();
        }
        //>>excludeEnd("production");
        else {
          // possibly still downloading?
          appCache.addEventListener('updateready', onUpdateAvailable, false);
        }
      }
    },

    regularlyCheckForUpdates: function(frequency) {
      setInterval(function() {
        if (applicationCache.status === applicationCache.IDLE) {
          applicationCache.update();
        }
      }, frequency * 1000);
    }
  });

  return store;
});