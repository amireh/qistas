/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var _ = require('ext/underscore');
  var t = require('i18n!components/account_picker');
  var Dropdown = require('jsx!components/dropdown');
  var Chosen = require('jsx!components/chosen');

  var DropdownToggle = Dropdown.Toggle;
  var DropdownMenu = Dropdown.Menu;
  var findBy = _.findBy;
  var PLACEHOLDER = [
    { label: null }
  ];

  /**
   * @class Components.SimpleAccountPicker
   *
   * [brief component description]
   */
  var SimpleAccountPicker = React.createClass({
    mixins: [ React.addons.ActorMixin ],

    propTypes: {
      accounts: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        name: React.PropTypes.string,
        balance: React.PropTypes.number,
        currency: React.PropTypes.string
      }))
    },

    getDefaultProps: function() {
      return {
        onChange: null,
        accounts: [],
        activeAccountId: null
      };
    },

    render: function() {
      var accounts = this.props.accounts.filter(function(account) {
        return !account.isNew;
      });

      return (
        <div className="account-picker mode-simple">
          <Chosen
            width="inherit"
            withArrow
            placeholder={t('choose_account', 'Choose an Account')}
            deselectable={this.props.deselectable}
            onChange={this.activateAccount}
            name={this.props.name}
            value={this.props.activeAccountId || ''}
            children={PLACEHOLDER.concat(accounts).map(this.renderAccount)} />
        </div>
      );
    },

    renderAccount: function(account) {
      return (
        <option key={account.id} className="list-item" value={account.id}>
          {account.label}
        </option>
      );
    },

    activateAccount: function(e) {
      if (this.props.onChange) {
        return this.props.onChange(e.target.value);
      }

      this.sendAction('accounts:activate', { id: e.target.value });
    }
  });

  return SimpleAccountPicker;
});