define(function(require) {
  var Pixy = require('ext/pixy');
  var RSVP = require('rsvp');
  var get = require('util/get');
  var SessionStore = require('stores/sessions');
  var Notifications = require('stores/notifications');
  var ActionCenter = require('stores/action_center');
  var Operations = require('stores/operations');
  var UserStore = require('stores/users');
  var RealtimeStore = require('stores/realtime');
  var PopupStore = require('stores/popups');
  var AppStore = require('stores/app');
  var K = require('constants');
  var RouteActions = require('actions/routes');
  var RouteMixins = require('pixy/mixins/routes');
  var User = require('core/current_user');
  var Responsifier = require('modules/responsifier');
  var UIController = require('core/ui_controller');
  var ErrorReport = require('models/error_report');

  var RootRoute = Pixy.Route.extend({
    mixins: [ RouteMixins.Props ]
  });

  /**
   * @internal {RSVP.Promise} applicationLayout
   *
   * The AppLayout once it's been mounted.
   */
  var applicationLayout = RSVP.defer();

  var handlingRoutingError = false;

  var rootRoute = new RootRoute('root', {
    /** Convenient property getter. */
    get: get,

    events: {
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
        UIController.render(component, layoutName, options || {});
      },

      renderMany: function(specs) {
        UIController.renderMany(specs);
      },

      collapseDrawer: function() {
        UIController.collapseDrawer();
      },

      update: function(props, iKnowWhatImDoing) {
        // Evil but very nice hack/optimization when logging out: no need to set
        // the props when the user is being cleared and do all those renders for
        // nothing!
        //
        // Besides, this way the components are guaranteed that auth-exclusive
        // props are always present as long as they're mounted.
        if (SessionStore.isTearingDown() && iKnowWhatImDoing !== true) {
          console.info('Blocking prop updates:', Object.keys(props));
          return;
        }
        else if (SessionStore.isTearingDown()) {
        }

        UIController.update(props);
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
        UIController.remove(component, layoutName, options || {});
      },

      storeError: function(error) {
        UIController.update({ storeError: error });
      },

      error: function(error, transition) {
        console.warn(Array(80).join('*'));
        console.warn('AppRoute received an error:');
          console.warn('\tError:', error, (error && error.stack ? error.stack : undefined));
          console.warn('\tTransition:', transition);
        console.warn(Array(80).join('*'));

        switch(error) {
          case K.ERROR_ACCESS_UNAUTHORIZED:
            this.onUnauthorizedError();
          break;

          case K.ERROR_ACCESS_OVERAUTHORIZED:
            this.onOverauthorizedError(transition);
          break;

          default:
            this.onRoutingError(error, transition)
        }

        return false;
      },

      loading: function(state) {
        UIController.setLoadingState(state);
      }
    },

    model: function() {
      var that = this;

      if (this.isAuthenticated()) {
        this.loading = true;

        return RSVP.all([]).finally(function() {
          that.loading = false;
        });
      }
      else {
        return RSVP.resolve({});
      }
    },

    ready: function(callback) {
      UIController.start().then(callback);
    },

    isReady: function() {
      return UIController.hasStarted();
    },

    isAuthenticated: function() {
      return SessionStore.isActive();
    },

    setup: function() {
      SessionStore.addChangeListener(this.switchAuthStates, this);

      Responsifier.on('change', this.updateProps, this);
      Notifications.addChangeListener(this.updateProps, this);
      ActionCenter.addChangeListener(this.updateProps, this);
      Operations.addChangeListener(this.updateProps, this);
      UserStore.addChangeListener(this.updateProps, this);
      RealtimeStore.addChangeListener(this.updateProps, this);
      PopupStore.addChangeListener(this.updateProps, this);
      AppStore.addChangeListener(this.updateProps, this);
    },

    enter: function() {
      this.updateProps();
    },

    /**
     * @private
     *
     * Transitions to and from the guest status to member status by changing
     * the app layout and redirecting to the appropriate landing page.
     */
    switchAuthStates: function() {
      var isAuthenticated = this.get('isAuthenticated');
      var reload = this.reload.bind(this);
      var enter = this.enter.bind(this);
      var transitionToZone = isAuthenticated ?
        this.transitionToMemberZone.bind(this) :
        this.transitionToGuestZone.bind(this);

      UIController.setTransitioningState(true).then(function() {
        reload().then(transitionToZone).finally(function() {
          enter();
          UIController.setTransitioningState(false);
        });
      });
    },

    transitionToGuestZone: function() {
      return RouteActions.home();
    },

    transitionToMemberZone: function() {
      return RouteActions.home();
    },

    updateProps: function() {
      if (this.loading) {
        return;
      }

      console.debug('Root: updating props.');

      this.update({
        authenticated: this.isAuthenticated(),
        user: User.toProps(),
        notifications: Notifications.getAll(),
        actionCenter: ActionCenter.getAll(),
        operations: Operations.getAll(),
        realtime: RealtimeStore.toProps(),
        platform: Responsifier.platform,
        activePopupId: PopupStore.getActiveId(),
        updateAvailable: AppStore.isUpdateAvailable()
      });
    },

    onUnauthorizedError: function() {
      this.transitionTo('/login');
    },

    onOverauthorizedError: function(transition) {
      var targetHandler = transition.router.getHandler(transition.targetName);

      if (targetHandler.isSecondary) {
        RouteActions.backToPrimaryView();
      } else {
        RouteActions.back();
      }
    },

    onRoutingError: function(error, transition) {
      if (!handlingRoutingError) {
        handlingRoutingError = true;

        if (this.isReady()) {
          if (!transition || !transition.pivotHandler) {
            transition = RouteActions.home();

            // Inject a notification error once the transition is done.
            transition.promise.then(function injectError() {
              handlingRoutingError = false;

              UIController.update({
                error: error,
                loading: false
              });
            });
          }
        }
        else {
          transition = transition || {};

          new ErrorReport('routing error, app hasnt started', error, {
            transition: {
              intent: transition.intent,
              targetName: transition.targetName,
              sequence: transition.sequence
            }
          });
        }
      }
    }
  });

  console.log('Root route loaded.');
});