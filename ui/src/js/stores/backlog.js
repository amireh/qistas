define(function(require) {
  var Pixy = require('pixy');
  var Psync = require('psync');
  var User = require('core/current_user');
  var ajax = require('core/ajax');

  var Journal = Psync.Journal;
  var uniqueId = 0;
  var showingJournal = false;

  return new Pixy.Store('backlog', {
    initialize: function() {
      Journal.on('change', this.emitChange, this);

      Psync.Persistence.load();
    },

    toProps: function() {
      var props = {
        pendingCount: Journal.length,
        showingJournal: showingJournal
      };

      if (props.showingJournal) {
        props.pending = Journal.toJSON().records;
        props.dropped = [];
      }

      return props;
    },

    actions: {
      commit: function(params, onChange, onError) {
        ajax({
          url: User.get('links.journals'),
          type: 'POST',
          data: JSON.stringify(Psync.Journal.toJSON())
        }).then(function(resp) {
          Psync.Journal.discardProcessed(resp.processed);
          onChange();
        }, onError);
      },

      discard: function(params, onChange) {
        if (Journal.removeAt(params.path, params.opcode)) {
          onChange();
        }
      },

      showJournal: function(_, onChange) {
        if (!showingJournal) {
          showingJournal = true;
          onChange();
        }
      },

      hideJournal: function(_, onChange) {
        if (showingJournal) {
          showingJournal = false;
          onChange();
        }
      }
    },
  });
});