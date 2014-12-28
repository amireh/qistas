/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Dialog = require('jsx!components/dialog');
  var t = require('i18n!guest/security');

  var Security = React.createClass({
    render: function() {
      return <Dialog
        onClose={this.props.onClose}
        title={t('dialog_title', 'Pibi - Security')}
        noPadding
        children={this.renderContent()} />
    },

    renderContent: function() {
      return(
        <article>
          <p>We know that your financial data is private and sensitive, so we've taken
            many technical measures to make your activity on Pibi super-safe.
          </p>

          <p>Here's a human-readable brief of some of these measures:</p>

          <p><strong>System security</strong></p>
          <p>Our servers hosting the Pibi app
            (the one you're currently using) as well as the Pibi API and the Pibi Cloud
            are monitored constantly, 24/7, by our admin staff.
          </p>

          <p>Server software and OS are always kept up-to-date to ensure that any security
            vulnerabilities that may arise in 3rd-party software are immediately dealt with.
          </p>

          <p><strong>Connection security</strong></p>
          <p>
            The connection between your devices and every Pibi server is <a href="http://en.wikipedia.org/wiki/Encryption" target="_blank">encrypted</a> over an <a href="http://en.wikipedia.org/wiki/SSL">SSL</a> link.
          </p>

          <p><strong>Software security</strong></p>
          <p>
            Your account password gets encrypted before we store it in our database.
            This means that even the Pibi team (us guys) can't actually tell what your
            password is!
          </p>

          <p>In the unfortunate and unlikely case where an authentication server does get compromised,
            access to your account will still be extremely difficult; we will
            simply re-issue a password for you and notify you by email.
          </p>

          <p><strong>Data security &amp; backups</strong></p>
          <p>We perform rolling-backups of your data every few hours to guard against
            power and hardware failures, or any kind of data integrity violation.
            You won't lose your data!
          </p>

          <p><strong>Employee access</strong></p>
          <p>No member of the Pibi team will ever access your data (or your account)
            unless required for assistance with a support ticket.
          </p>
          <p>We might, however, access accounts <em>anonymously</em> when required for support reasons
            (such as performing code updates). But even in those cases, it is only the structure
            of the data that is dealt with, and not the data itself.
          </p>
        </article>
      );
    }
  });

  return Security;
});