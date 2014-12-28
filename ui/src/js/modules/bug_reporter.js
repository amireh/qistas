define([ 'ext/underscore', 'ext/pixy' ], function(_, Pixy) {
  'use strict';

  /**
   * @method
   *
   * Dumps useful information from a JavaScript Error exception into a JSON construct.
   *
   * @param  {Error} e
   * A JavaScript Error object.
   *
   * @return {Object}
   * The JSONified error.
   */
  var exceptionToJSON = function(e) {
    return {
      type:     e.type,
      name:     e.name,
      message:  e.message,
      stack:    e.stack
    };
  };

  /**
   * @class Pibi.Modules.BugReporter
   * @extends Pixy.Collection
   * @singleton
   *
   * An interface for submitting bugs and crash reports to the API so that the
   * devs can take a look at funny stuff that happen to users.
   */
  var BugReporter = Pixy.Collection.extend({
    name: 'BugReporter',

    model: Pixy.Model.extend({
      urlRoot: '/submissions/bugs'
    }),

    module: 'bugReporter',

    objects: [],

    /**
     * Track an object whose state will be attached to each bug report.
     *
     * @param {String} key
     *        The key to bind the object's dump state to in the report.
     *
     * @param {#dump} object
     *        The object to dump when a bug submission is made.
     *
     * @throws {TypeError} If the object does not respond to #dump.
     */
    addObject: function(key, object) {
      if (!key || !object) {
        throw new TypeError('Missing key or object.');
      }

      if (!_.isString(key)) {
        throw new TypeError('Object key must be a valid string.');
      }

      if (!_.isFunction(object.dump)) {
        throw new TypeError('Object must respond to #dump');
      }

      this.objects.push({ key: key, object: object });
    },

    onDependency: function(object) {
      if (_.isFunction(object.dump)) {
        // var id = object.name || object.id || object.toString();
        var id = object.toString();
        // this.debug('Automatically tracking object:', id);
        this.addObject(id, object);
      }
    },

    /**
     * Submit a new bug submission to the Pibi API.
     *
     * @param  {Object} context
     *         Any relevant context to attach to the submission.
     */
    create: function(context) {
      var data = _.extend({}, { context: context });

      this.objects.map(function(objectEntry) {
        var key = objectEntry.key;
        var object = objectEntry.object;

        try {
          data[key] = object.dump();
        } catch(e) {
          data[key] = null;

          data.dumpErrors = data.dumpErrors || [];
          data.dumpErrors.push({ module: key, error: exceptionToJSON(e) });
        }
      });

      Pixy.Collection.prototype.create.apply(this, [ data, { wait: false } ]);
    }
  });

  return new BugReporter();
});