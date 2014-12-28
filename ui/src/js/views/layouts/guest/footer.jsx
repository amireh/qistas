/** @jsx React.DOM */
define([ 'react', 'i18n!guest/footer' ], function(React, t) {
  var GuestFooter = React.createClass({
    getDefaultProps: function() {
      return {
      };
    },

    render: function() {
      return(
        <footer id="guest_footer" className="container">
          <div className="row-fluid footer-links">
            <div className="span4">
              <strong className="footer-links-heading">{t('pibi', 'Pibi')}</strong>

              <a className="footer-link" href="/about">{t('about', 'About')}</a>
              <a className="footer-link" href="/faq">{t('faq', 'FAQ')}</a>
              <a className="footer-link" href="http://support.pibiapp.com" target="_blank">
                {t('support', 'Support')}
              </a>
              <a className="footer-link" href="http://support.pibiapp.com" target="_blank">
                {t('feedback', 'Feedback')}
              </a>
            </div>

            <div className="social-links span4 offset4 text-right">
              <strong className="footer-links-heading">
                {t('social_pibi', 'Social Pibi')}
              </strong>
              <a target="_blank" href="http://www.facebook.com/pibiapp">
                <i className="icon-facebook2  icon-24"></i>
              </a>
              <a target="_blank" href="http://www.twitter.com/pibiapp" >
                <i className="icon-twitter2   icon-24"></i>
              </a>
              <a
                href="//plus.google.com/106700740788619671040?prsrc=3"
                rel="publisher"
                target="_blank"
                style={ { 'text-decoration': 'none' } }>
                <i className="icon-google-plus icon-24"></i>
              </a>
            </div>
          </div>


          <div id="footer_partners" className="row text-center">
            <strong className="footer-links-heading">{t('partners', "Salati's Delightful Partners")}</strong>
            <a href="https://mixpanel.com/f/partner">
              <img src="//cdn.mxpnl.com/site_media/images/partner/badge_light.png" alt="Mobile Analytics" />
            </a>
          </div>

          <div id="footer_legal" className="row">
            <div className="static-links">
              <a href="/terms">{t('tos', 'Terms of Service')}</a>
              <a href="/privacy">{t('privacy', 'Privacy')}</a>
              <a href="/security">{t('security', 'Security')}</a>
            </div>

            <small className="copyright">
              &copy; 2014
              <a target="_blank" href="http://www.algollabs.com">Cheese Cake, LLC.</a>
              {t('all_rights_reserved', 'All rights reserved')}.
            </small>
          </div>
        </footer>
      );
    }
  });

  return GuestFooter;
});