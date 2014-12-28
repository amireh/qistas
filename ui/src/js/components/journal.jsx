/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var t = require('i18n!journal');
  var APIErrorDecorator = require('modules/api_error_decorator');
  var _ = require('underscore');
  var Entries = require('jsx!./journal/entries');
  var last = _.last;

  var extractEntries = function(records) {
    return records.reduce(function(entries, record) {
      var path = record.path;

      Object.keys(record.operations).forEach(function(opcode) {
        record.operations[opcode].forEach(function(entry) {
          var moddedEntry = {};

          moddedEntry.name = last(path.split('/'));
          moddedEntry.key = [ path, entry.id ].join('/');
          moddedEntry.type = opcode;
          moddedEntry.data = entry.data;

          if (!moddedEntry.data) {
            moddedEntry.data = { id: entry.id };
          }

          if (entry.error) {
            moddedEntry.error = APIErrorDecorator.parse(entry.error);
          }

          entries.push(moddedEntry);
        });
      });

      return entries;
    }, []);
  };

  var Journal = React.createClass({
    mixins: [ React.addons.ActorMixin ],

    getDefaultProps: function() {
      return {
        title: true,
        pending: [],
        dropped: []
      };
    },

    render: function() {
      return(
        <div id="journal">
          {this.props.title && <header><h2>{t('title', 'Pibi Journal')}</h2></header>}
          <p>{t('messages.description', 'The Pibi Journal keeps track of actions you have performed that have not yet been synchronized with the Pibi servers.')}</p>

          <section>
            <h4 className="pending-header">{t('headers.pending', 'Pending Actions')}</h4>
            {this.props.pending.length > 0 ?
              this.renderPending() :
              <p>
                {t('messages.no_pending', 'Your actions have been synchronized, there are no pending ones.')}
              </p>
            }
          </section>

          <section>
            <h4 className="dropped-header">{t('headers.dropped', 'Failed Actions')}</h4>

            {this.props.dropped.length > 0 ?
              this.renderDropped() :
              <p className="alert alert-success">
                {t('messages.no_failures', 'None! Everything looks good.')}
              </p>
            }
          </section>
        </div>
      );
    },

    renderPending: function() {
      return Entries({
        entries: extractEntries(this.props.pending),
        showData: true,
        onDiscard: this.discard
      });
    },

    renderDropped: function() {
      return Entries({
        entries: extractEntries(this.props.dropped),
        showError: true,
        onDiscard: this.discard
      });
    },

    discard: function(key, opcode) {
      this.sendAction('backlog:discard', { path: key, opcode: opcode });
    }
  });

  return Journal;
});