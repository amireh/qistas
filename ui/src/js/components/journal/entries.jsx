/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!journal');
  var tError = require('i18n!api_errors');
  var InflectionJS = require('inflection');

  var Entries = React.createClass({
    getDefaultProps: function() {
      return {
        entries: [],
        showError: false,
        showData: false
      };
    },
    render: function() {
      return (
        <div>
          <table className="table table-striped table-condensed">
            <thead>
              <tr>
                <th>{t('table.heading.resource', 'Resource')}</th>
                <th>{t('table.heading.operation', 'Operation')}</th>

                {this.props.showError &&
                  <th>{t('table.heading.error', 'Error')}</th>
                }

                {this.props.showData &&
                  <th>{t('table.heading.data', 'Data')}</th>
                }

                <th>{t('table.heading.actions', 'Actions')}</th>
              </tr>
            </thead>

            <tbody>
              {this.props.entries.map(this.renderEntry)}
            </tbody>
          </table>
        </div>
      );
    },

    renderEntry: function(entry, idx) {
      return (
        <tr key={entry.key + '-' + idx}>
          <td>{entry.name.singularize().humanize()}</td>
          <td>{entry.type.humanize()}</td>

          {this.props.showError &&
            <td>{tError(entry.error.code, entry.error.message)}</td>
          }

          {this.props.showData &&
            <td>
              <pre>
                {entry.data ? JSON.stringify(entry.data, null, 2) : '-'}
              </pre>
            </td>
          }

          <td>
            <a onClick={this.props.onDiscard.bind(null, entry.key, entry.type)}>
              {t('actions.discard', 'Discard')}
            </a>
          </td>
        </tr>
      );
    },
  });

  return Entries;
});