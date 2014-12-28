define([ 'ext/underscore', 'ext/pixy' ], function(_, Pixy) {
  'use strict';

  /**
   * @class Pibi.Modules.Backlog
   * @extends Pixy.Collection
   * @singleton
   *
   * A log of recoverable operations that can be rolled back if the user chooses
   * to, like deleting a transaction or a category or any resource.
   */
  var Backlog = Pixy.Collection.extend({
    model: Pixy.Model.extend({
      defaults: {
        description: 'Recoverable operation.',
        action: function() {}
      }
    }),

    /**
     * Add an action that can be undone to the backlog.
     *
     * @param {Object} entry
     *        The definition of the recoverable effect entry.
     *
     * @param {String} entry.description
     *        A short reminder of the effect to display to the user.
     *
     * @param {Function} entry.action
     *        The callback to invoke when the entry is consumed, ie the user
     *        pushes undo.
     */
    add: function(data) {
      var id;

      id = _.uniqueId('be');
      data = _.extend({}, data, {
        id: id
      });

      Pixy.Collection.prototype.add.apply(this, [ data ]);

      return id;
    },

    /**
     * Undo a recoverable action.
     *
     * @param {Number} [entryId=-1]
     *        The entry index to undo, otherwise the last entry is popped.
     *
     * @return {Boolean}
     *         Whether an action has been undone.
     */
    undo: function(entryId) {
      var entry;

      if (!this.models.length) {
        return false;
      }

      if (entryId) {
        entry = this.find({ id: entryId });

        if (!entry) {
          throw 'bad backlog entry: ' + entryId;
        }
      } else {
        entry = this.last();
      }

      this.remove(entry);

      try {
        entry.get('action')();
      } catch(e) {
        console.error("Backlog entry failed to recover:", e.message);

        throw e;
      }

      /**
       * @event backlog_consumed
       * An action has been undone from the backlog.
       *
       * @param {String} description The entry's description.
       */
      this.trigger('consumed', entry.description);

      if (!this.models.length) {
        /**
         * @event backlog_empty
         * There are no more undo-able actions tracked in the backlog.
         */
        this.trigger('empty');
      }

      return true;
    }
  });

  return Backlog;
});