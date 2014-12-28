/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!guest/navigation');
  var AppStore = require('stores/app');
  var K = require('constants');

  var GuestNavigation = React.createClass({
    render: function() {
      var inHome = AppStore.currentPrimaryRoute() === K.GUEST_PRIMARY_ROUTE;

      return(
        <nav id="guest_nav" className="guest-nav container">
          <a className={inHome ? 'active' : undefined} href="/welcome">
            {t('home', 'Home')}
          </a>

          <a href="http://support.pibiapp.com" target="_blank">
            {t('support', 'Support Center')}
          </a>

          <a href="/login">
            {t('login', 'Login')}
          </a>
        </nav>
      );
    }
  });

  return GuestNavigation;
});