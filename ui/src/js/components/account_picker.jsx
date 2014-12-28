/** @jsx React.DOM */
define([
  'ext/react',
  'ext/underscore',
  'i18n!components/account_picker',
  'jsx!components/dropdown',
  'jsx!components/balance',
],
function(React, _, t, Dropdown, Balance) {
  var DropdownToggle = Dropdown.Toggle;
  var DropdownMenu = Dropdown.Menu;
  var findBy = _.findBy;

  /**
   * @class Components.AccountPicker
   *
   * [brief component description]
   */
  var AccountPicker = React.createClass({
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
        accounts: [],
        activeAccountId: null
      };
    },

    render: function() {
      var accounts = this.props.accounts.filter(function(account) {
        return !!account.id;
      });

      var activeAccount = findBy(accounts, {
        id: this.props.activeAccountId
      }) || { label: t('choose_account', 'Choose an Account') };

      return (
        <div className="account-picker">
          <Dropdown sticky={true}>
            <DropdownToggle withArrow className="statusbar-btn btn-block">
              <span className="active-account">{activeAccount.label}</span>
            </DropdownToggle>

            <DropdownMenu tagName="ul" className="list-view sticky">
              <li className="list-separator">{t('choose_account', 'Choose an Account')}</li>

              {accounts.map(this.renderAccount)}

              <li className="list-actions">
                <a
                  href="/settings/accounts"
                  className="unstyled btn btn-default btn-mini btn-block">
                  {t('manage_accounts', 'Manage Accounts')}
                </a>
              </li>
            </DropdownMenu>
          </Dropdown>

          <Balance
            className="account-balance"
            amount={activeAccount.balance}
            currency={activeAccount.currency} />
        </div>
      );
    },

    renderAccount: function(account) {
      return (
        <li
          onClick={this.activateAccount.bind(null, account.id)}
          key={account.id}
          className="list-item">
          <button className="btn-a11y">{account.label}</button>
          <div className="stick-right">
            <Balance amount={account.balance} />
            <span>{' ' + account.currency}</span>
          </div>
        </li>
      );
    },

    activateAccount: function(id) {
      this.sendAction('accounts:activate', { id: id });
    }
  });

  return AccountPicker;
});