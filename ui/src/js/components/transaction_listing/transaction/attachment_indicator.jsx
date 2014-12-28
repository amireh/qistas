/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!components/transaction_listing');
  var AttachmentIndicator = React.createClass({
    getDefaultProps: function() {
      return {
        attachments: []
      };
    },

    render: function() {
      var attachmentCount = this.props.attachments.length;

      if (!attachmentCount) {
        return <span />;
      }

      return(
        <div
          title={t('tooltips.has_attachments', {
            defaultValue: 'This transaction has __count__ attached files.',
            count: attachmentCount
          })}
          className="tx-attachments">
          <i className="icon-link" />

          <ul>
            {this.props.attachments.map(this.renderAttachmentLink)}
          </ul>
        </div>
      );
    },

    renderAttachmentLink: function(attachment) {
      return (
        <li key={attachment.id}>
          <a target="_pibi_attachments" href={attachment.links.item}>
            {attachment.fileName}
          </a>
        </li>
      );
    }
  });

  return AttachmentIndicator;
});