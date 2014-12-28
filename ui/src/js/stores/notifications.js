define(function(require) {
  var Pixy = require('pixy');
  var _ = require('lodash');
  var throttle = _.throttle;

  return new Pixy.Store('notifications', {
    initialize: function() {
      this.run = throttle(this.run.bind(this), 100, {
        leading: false,
        trailing: true
      });
    },

    getInitialState: function() {
      return {
        notifiers: [],
        notifications: [],
        dismissed: [],
        watchedTargets: {}
      };
    },

    registerWatcher: function(notifier) {
      var watchTargets = notifier.watchTargets || [];
      var watchedTargets = this.state.watchedTargets;
      var run = this.run;

      // listen to all targets we aren't currently listening to:
      watchTargets.filter(function(target) {
        return !watchedTargets.hasOwnProperty(target);
      }).forEach(function(target) {
        watchedTargets[target] = [];
        target.addChangeListener(run);
      });

      // mark the notifier as a dependency of the target, so we can stop
      // listening when all notifiers are removed:
      watchTargets.forEach(function(target) {
        watchedTargets[target].push(notifier);
      });

      // track the notifier so we invoke it when its targets change:
      this.state.notifiers.push(notifier);

      // internal; we'll keep track of all notifications spawned by the notifier
      // in this array so we can remove them when it gets removed:
      notifier.__items__ = [];
    },

    removeWatcher: function(notifier) {
      var index = this.state.notifiers.indexOf(notifier);
      var watchedTargets = this.state.watchedTargets;
      var run = this.run;

      if (index > -1) {
        this.state.notifiers.splice(index, 1);

        // stop listening to targets that have no notifiers interested in left:
        notifier.watchTargets.forEach(function(target) {
          var notifiers = watchedTargets[target];
          var index = notifiers.indexOf(notifier);

          if (index > -1) {
            notifiers.splice(index, 1);

            if (notifiers.length === 0) {
              target.removeChangeListener(run);

              // some love to the GC!
              delete watchedTargets[target];
            }
          }
        });

        // automatically dismiss any notifications spawned by the notifier:
        if (notifier.__items__.length) {
          this.setState({
            notifications: this.state.notifications.filter(function(n) {
              return notifier.__items__.indexOf(n) === -1;
            })
          });

          delete notifier.__items__;
        }
      }
    },

    /**
     * @return {Models.Notification[]}
     *         All available notifications. Notifications that were dismissed
     *         by the user will not be returned.
     */
    getAll: function() {
      var dismissed = this.state.dismissed;

      return this.state.notifications.filter(function(notification) {
        return dismissed.indexOf(notification.id) === -1;
      }).map(function(notification) {
        return notification.toJSON();
      });
    },

    run: function() {
      this.state.notifications =
        this.state.notifiers.reduce(function(notifications, notifier) {
          var newItems = notifier();
          notifier.__items__ = notifier.__items__.concat(newItems);
          return notifications.concat(newItems);
        }, []);

      this.emitChange();
    },

    actions: {
      /**
       * Dismiss a notification during the current session. Dismissals do not
       * currently persist through page refreshes.
       *
       * @param  {String} id
       *         The unique notification id.
       */
      dismiss: function(id, onChange/*, onError*/) {
        var dismissed = this.state.dismissed;

        if (dismissed.indexOf(id) === -1) {
          dismissed.push(id);
          onChange();
        }
      },

      // success: function(message) {
      //   Notifier.success(message);
      // }
    },
  });
});