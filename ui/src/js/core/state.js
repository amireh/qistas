define([
  'ext/underscore',
  'ext/pixy',
  'moment',
  'core/environment',
  'modules/backlog'
], function(_, Pixy, moment, Env, Backlog) {
  var CacheableMixin = Pixy.Mixins.Cacheable;

  /**
   * @class Pibi.Core.State
   * @singleton
   * @extends Pixy.DeepModel
   *
   * The application state.
   */
  var State = Pixy.DeepModel.extend(CacheableMixin, {
    name: 'State',

    defaults: {
      datePeriod: {
        from: moment().startOf('month').format('MM/DD/YYYY'),
        to: moment().endOf('month').format('MM/DD/YYYY'),
        format: 'MM/DD/YYYY'
      }
    },

    cache: {
      key: 'state',
      preload: false
    },

    startedAt: new Date(),

    validateDatePeriod: function() {
      var fmt = this.get('datePeriod.format');
      var from = moment(this.get('datePeriod.from'));
      var to = moment(this.get('datePeriod.to'));

      var isValid = to.isSame(from) || to.isAfter(from);

      if (!isValid) {
        console.warn("Bad date period ",
          this.get('datePeriod'),
          "... resetting to default");
        this.set('datePeriod', this.defaults.datePeriod, { validate: false });
      }
    },

    initialize: function() {
      this.listenTo(this, 'change:datePeriod.*', this.validateDatePeriod);
      this.listenTo(this, 'change:datePeriod.*', this.updateQueryParams);

      if (Env.query.from && Env.query.to) {
        console.info("Deserializing date period from queryParams:", Env.query);

        this.set('datePeriod', {
          from: Env.query.from,
          to: Env.query.to
        });
      }

      this.backlog = new Backlog();
    },

    /** Invoked when the app router has fired and viewport launched */
    setup: function() {
      this.updateCacheEntry();
    },

    dump: function() {
      return {
        today: moment().unix(),
        startedAt: moment(this.startedAt).unix()
      };
    },

    reload: function() {
      _.defer(function() {
        this.router.refresh();
      }, this);

      return this;
    },

    restart: function() {
      try {
        Pixy.history.location.reload();
      } catch (e) {
        // location.reload() might raise an exception on Android in Phonegap
      }

      try {
        location.reload();
      } catch(e) {}

      try {
        document.location = 'index.html';
      } catch(e) {}

      try {
        window.location.href = window.location.href;
      } catch(e) {}
    },

    updateQueryParams: function() {
      Env.updateQueryString({
        from: this.get('datePeriod').from,
        to: this.get('datePeriod').to
      });
    }
  });

  return new State();
});
