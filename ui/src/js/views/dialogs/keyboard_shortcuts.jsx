/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Keymapper = require('util/keymapper');
  var Dialog = require('jsx!components/dialog');
  var _ = require('lodash');
  var t = require('i18n!dialogs/keyboard_shortcuts');
  var findBy = _.findWhere;
  var sortBy = _.sortBy;

  var KeyboardShortcuts = React.createClass({
    render: function() {
      var keyBindings = Keymapper.getKeyBindings().reduce(function(set, binding) {
        if (!findBy(set, { key: binding.key, context: binding.context })) {
          return set.concat(binding);
        }
        else {
          return set;
        }
      }, []);

      keyBindings = sortBy(keyBindings, 'context');

      return(
        <Dialog
          title={t('title', 'Keyboard Shortcuts')}
          onClose={this.props.onClose}
          scrollable>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('key', 'Key')}</th>
                <th>{t('action', 'Action')}</th>
                <th>{t('context', 'Where it works')}</th>
              </tr>
            </thead>
            <tbody>
              {keyBindings.map(this.renderBinding)}
            </tbody>
          </table>
        </Dialog>
      );
    },

    renderBinding: function(binding) {
      return (
        <tr>
          <td>{binding.key.toUpperCase()}</td>
          <td>{binding.description}</td>
          <td>{binding.context}</td>
        </tr>
      );
    }
  });

  return KeyboardShortcuts;
});