define([ 'ext/underscore', 'ext/pixy' ], function(_, Pixy) {
  var BACKOFF_EXPONENTIAL = 1;
  var BACKOFF_FIBONACCI = 2;

  /**
   * @class Pibi.Util.DeferredOp
   * @extends Pixy.Model
   *
   * An action scheduler interface. Useful for actions that are repeated,
   * retried, throttled, or delayed.
   */
  return Pixy.Model.extend({

    initialize: function(object, callback, options) {
      if (!callback) {
        throw "[deferred_op]: invalid argument @callback, must be a callable object, got " + typeof(callback);
      }

      this.options = {};

      _.extend(this.options, {
        pulse: 250,
        withFlag: false,
        autoqueue: false,
        backoff: false,
        maxRetries: 0,
        maxDelay: 10000,
        backoffStrategy: 'exponential'
      }, options);

      this.timer      = null;
      this.retries    = 0;
      this.__callee   = object; /* for lack of better name, caller and callee are reserved... */
      this.__method   = callback;

      switch(this.options.backoffStrategy) {
        case "exponential":
          this.options.backoffStrategy = BACKOFF_EXPONENTIAL;
          break;
        case "fibonacci":
          this.options.backoffStrategy = BACKOFF_FIBONACCI;
          break;
        default:
          throw "unrecognized backoff strategy '" + this.options.backoffStrategy + "'";
      }

      if (this.options.backoff) {
        this.options.autoqueue  = false;
        this.initial_pulse      = this.options.pulse;
      }

      return this;
    },

    __invokeWithFlag: function() {
      var params = _.flatten(arguments);

      params.push(true);

      this.backoff();

      return this.__method.apply(this.__callee, params);
    },

    __invoke: function() {
      this.backoff();
      return this.__method.apply(this.__callee, arguments);
    },

    __start: function(callback) {
      this.stop();

      if (this.options.autoqueue) {
        this.timer = setInterval(callback, this.options.pulse);
      }
      else {
        this.timer = setTimeout(callback, this.options.pulse);
      }

      return this;
    },

    /**
     * Starts the recurring timer.
     */
    start: function() {
      if (this.options.autoqueue || this.options.backoff) {
        this.queue();
      }

      return this;
    },

    /**
     * Stops the timer.
     */
    stop: function() {
      if (this.timer) {
        if (this.options.autoqueue) {
          this.timer = clearInterval(this.timer);
        } else {
          this.timer = clearTimeout(this.timer);
        }

        delete this.timer;
      }

      return this;
    },
    // alias to stop
    cancel: function() { return this.stop(); },

    reset: function() {
      if (!this.options.backoff) {
        throw "#reset called on a non-backoff deferred operation, use #stop instead";
      }

      this.stop();
      this.retries = 0;
      this.options.pulse = this.initial_pulse;

      return this;
    },

    restart: function() {
      if (!this.options.backoff) {
        throw "#reset called on a non-backoff deferred operation, use #stop instead";
      }

      return this.reset().start();
    },

    /**
     * Queues an operation invocation.
     *
     * This will restart the timer.
     */
    queue: function() {
      var me    = this,
          args  = arguments;

      if (this.disabled) {
        return this;
      }

      if (this.options.withFlag) {
        this.__start(function() { return me.__invokeWithFlag.apply(me, args); });
      } else {
        this.__start(function() { return me.__invoke.apply(me, args); });
      }

      return this;
    },

    backoff: function() {
      if (this.options.backoff) {
        if (++this.retries == this.options.maxRetries) {
          return this.reset().trigger('failed');
        }

        // step our pulse
        if (this.options.backoffStrategy == BACKOFF_EXPONENTIAL) {
          this.options.pulse *= 2;

          if (this.options.pulse > this.options.maxDelay) {
            this.options.pulse = this.options.maxDelay;
          }

        }
        else if (this.options.backoffStrategy == BACKOFF_FIBONACCI) {
          // TODO: implement
          throw 'unimplemented';
        }

        this.queue().trigger('retry', this.options.pulse);
      }
    }
  });
});