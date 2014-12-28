/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var t = require('i18n!navigation');
  var Places = require('jsx!./navigation/places');
  var _ = require('ext/underscore');

  var findBy = _.findBy;
  var classSet = React.addons.classSet;

  var Navigation = React.createClass({
    getDefaultProps: function() {
      return {
        accounts: []
      };
    },

    render: function() {
      var accounts = this.props.accounts.filter(function(account) {
        return !!account.id;
      });

      var activeAccount = findBy(accounts, {
        id: this.props.activeAccountId
      }) || {
        label: t('no_account', 'None')
      };

      var accountsLinkClassName = classSet({
        'navbar-link': true,
        'active': this.props.active === 'accounts'
      });

      return(
        <div>
          <nav id="navbar" onClick={this.collapse}>
            <Places active={this.props.active} activeChild={this.props.activeChild} />

            <div className="group">
              <header className="navbar-header">
                {t('headers.misc', 'Misc.')}
              </header>

              <a href="/accounts" className={accountsLinkClassName}>
                {t('choose_account', 'Choose an Account')}

                <span className="pull-right">
                  {activeAccount.label}
                </span>
              </a>

              <a href="/settings" className="navbar-link">
                {t('settings', 'Settings')}
              </a>

              <a href="/logout" className="navbar-link">
                {t('logout', 'Logout')}
              </a>
            </div>
          </nav>

          <footer id="navbar-footer">
            {t('identity', {
              defaultValue: 'You are currently logged in as __email__',
              email: this.props.user.email
            })}
          </footer>
        </div>
      );
    },

  });

  return Navigation;
});