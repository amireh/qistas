/** @jsx React.DOM */
define([ 'react', 'config', 'i18n!oauth' ], function(React, Config, t) {
  var OauthLinks = React.createClass({
    getDefaultProps: function() {
      return {
        facebook: Config.oauth.facebook,
        google: Config.oauth.google
      };
    },

    render: function() {
      return(
        <div className="oauth-links">
          <a
            href={this.props.facebook}
            rel="tooltip"
            title={t('tooltips.facebook', 'Sign in using your Facebook account')}>
            <i className="icon-facebook"></i>
          </a>
          {' '}
          <a
            href={this.props.google}
            rel="tooltip"
            title={t('tooltips.google', 'Sign in using your Google account')}>
            <i className="icon-google-plus2"></i>
          </a>
        </div>
      );
    }
  });

  return OauthLinks;
});