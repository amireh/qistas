/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!guest/index');
  var Environment = require('core/environment');
  var TransactionListing = require('jsx!components/transaction_listing');

  var GuestIndex = React.createClass({
    render: function() {
      var isMobile = this.props.platform === 'mobile';
      var logo = <div className="header-logo">
        <i className="icon-pibi-framed flip-in-y"></i>
      </div>;

      return(
        <div id="landing" className="row-fluid">
          <section className="container greeting hero-unit">
            <h1>
              {t('welcome', 'Salati')}
            </h1>

            <h2 className="landing-meme">
              <strong>
                {t('motto', 'Track your prayers, plan a better life.')}
              </strong>
            </h2>

            <div className="auth-actions">
              <a href="/signup" className="btn btn-huge btn-success">
                {t('signup', 'Sign Up')}
              </a>
              <a className="btn btn-default sign-in" href="/login">
                {t('login', 'Login')}
              </a>
            </div>
          </section>
        </div>
      );
    }
  });

  return GuestIndex;
});