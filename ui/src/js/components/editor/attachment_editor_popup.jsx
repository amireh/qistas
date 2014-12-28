/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var _ = require('ext/underscore');
  var t = require('i18n!transaction_editor');
  var Common = require('./common');
  var Popup = require('jsx!components/popup');
  var AttachmentEditor = require('jsx!components/attachment_editor');
  var Label = require('jsx!components/sidebar_label');

  var AttachmentEditorPopup = React.createClass({
    propTypes: {
      isNew: React.PropTypes.bool,
      links: React.PropTypes.shape({
        attachments: React.PropTypes.string
      }).isRequired,
      attachments: React.PropTypes.array.isRequired,
      linkState: React.PropTypes.func.isRequired,
    },

    getDefaultProps: function() {
      return {
        attachments: [],
        links: {},
      };
    },

    render: function() {
      return (
        <Popup
          key="attachment-editor"
          content={AttachmentEditor}
          popupOptions={Common.popupOptions}
          isNew={this.props.isNew}
          uploadUrl={this.props.links.attachments}
          attachments={this.props.attachments}
          onUpload={this.props.onUpload}
          onRemove={this.props.onRemove}
          reactivePositioning>
          <Label
            key="attachments"
            icon="icon-link"
            label={t('labels.attachments', 'Attachments')}>
            {this.props.attachments.length}
          </Label>
        </Popup>
      );
    }
  });

  return AttachmentEditorPopup;
});