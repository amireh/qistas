define(function(require) {
  var _ = require('ext/underscore');
  var moment = require('moment');
  var wrapArray = require('util/wrap_array');
  var K = require('constants');
  var sortBy = _.sortBy;
  var chain = _.chain;
  var findBy = _.findBy;

  var FMT_THIS_YEAR = 'YYYY';
  var FMT_THIS_MONTH = 'YYYY MM';
  var FMT_TODAY = 'YYYY MM DD';

  function format(date, formatter, defaultFormat) {
    date = moment.utc(date);

    if (formatter && typeof formatter === 'function') {
      return formatter(date);
    } else {
      return date.format(formatter || defaultFormat);
    }
  }

  function indexFor(dd, date) {
    /*jshint -W027*/
    switch(dd) {
      case K.DRILLDOWN_YEARS:
        return date.month() + 1;
        break;

      case K.DRILLDOWN_MONTHS:
      case K.DRILLDOWN_SINGLE_MONTH:
        return date.unix();
        break;

      case K.DRILLDOWN_DAYS:
      case K.DRILLDOWN_TODAY:
      case K.DRILLDOWN_YESTERDAY:
        return date.date();
        break;

      default:
        return 0;
    }
  }

  var Partition = function(id, index, date) {
    this.id = id;
    this.index = index;
    this.__date = date;
    this.items = [];

    return this;
  };

  Partition.prototype = {
    /**
     * @property {String} id
     *
     * A string representation of the period of time this partition represents.
     */
    id: undefined,

    /**
     * A unique index of this partition in its set.
     */
    index: 0,

    /**
     * @property {Object[]} items
     *
     * The set of items in this partition.
     */
    items: [],

    add: function(item) {
      this.items.push(item);
    },

    remove: function(item) {
      this.items.splice(this.items.indexOf(item), 1);
    },

    clear: function() {
      this.items = [];
    }
  };

  /**
   * Create a new partitioner.
   *
   * @param  {String} drilldownMode
   *         Domain
   * @return {[type]}               [description]
   */
  var TimePartitioner = function(drilldownMode, dateExtractor) {
    this.drilldownMode = drilldownMode;
    this.extractor = dateExtractor;
    this.partitions = [];

    return this;
  };

  var formats = {
    years: 'YYYY',
    months: 'MMMM, YYYY',
    days: function(date) {
      var now = moment.utc();
      var dayDistance = date.diff(now, 'days');

      return dayDistance > -6 && dayDistance < 1 ?
        date.calendar() :
        date.format("dddd, [the] Do");
    }
  };

  TimePartitioner.prototype = {
    setMode: function(drilldownMode) {
      this.drilldownMode = drilldownMode;

      if (!this.isEmpty()) {
        this.repartition();
      }
    },

    // create partitions and add each item to its partition
    add: function(items) {
      wrapArray(items).forEach(function(item) {
        this.partitionFor(this.extractor(item)).add(item);
      }.bind(this));
    },

    forEach: function(callback) {
      this.partitions.forEach(callback);
    },

    map: function(callback) {
      return this.partitions.map(callback);
    },

    sort: function() {
      this.partitions = sortBy(this.partitions, 'index');
    },

    clear: function() {
      this.partitions.forEach(function(partition) {
        partition.clear();
      });

      this.partitions = [];
    },

    /**
     * Test if a given partition represents items in the the current period of
     * time, based on the drilldown mode.
     *
     * For example, with a dd mode of "days", this will test if the partition
     * contains today's items, while with a dd mode of "months", the test will
     * tell if the partition represents this month's.
     *
     * @param  {Partition} partition
     *         The partition to test.
     *
     * @return {Boolean} Whether the partition is the latest.
     */
    isCurrent: function(partition, anchor) {
      var now = anchor || moment.utc();
      var date = partition.__date;
      var fmt;

      switch(this.drilldownMode) {
        case K.DRILLDOWN_YEARS:
          fmt = FMT_THIS_YEAR;
          break;

        case K.DRILLDOWN_MONTHS:
        case K.DRILLDOWN_SINGLE_MONTH:
          fmt = FMT_THIS_MONTH;
          break;

        case K.DRILLDOWN_DAYS:
        case K.DRILLDOWN_TODAY:
        case K.DRILLDOWN_YESTERDAY:
          fmt = FMT_TODAY;
          break;
      }

      return date.format(fmt) === now.format(fmt);
    },

    isToday: function(partition) {
      var now = moment.utc();
      var then = partition.__date;

      return then.format(FMT_TODAY) === now.format(FMT_TODAY);
    },

    /**
     * @internal
     */
    partitionFor: function(date) {
      var id, partition;
      var drilldownMode = this.drilldownMode;

      date = moment.utc(date);

      switch(drilldownMode) {
        case K.DRILLDOWN_YEARS:
          id = format(date, formats.years, 'YYYY');
        break;

        case K.DRILLDOWN_MONTHS:
          id = format(date, formats.months, 'MMMM, YYYY');
        break;

        case K.DRILLDOWN_SINGLE_MONTH:
        case K.DRILLDOWN_DAYS:
          id = format(date, formats.days, 'dddd, [the] Do');
        break;

        case K.DRILLDOWN_TODAY:
        case K.DRILLDOWN_YESTERDAY:
          id = format(date, formats.days, 'dddd, [the] Do');
        break;
      }

      partition = findBy(this.partitions, { id: id });

      if (!partition) {
        partition = new Partition(id, indexFor(drilldownMode, date), date);

        this.partitions.push(partition);
      }

      return partition;
    },

    isEmpty: function() {
      return 0 === chain(this.partitions)
        .pluck('items')
        .pluck('length')
        .concat([0])
        .max()
        .value();
    },

    repartition: function() {}
  };

  return TimePartitioner;
});