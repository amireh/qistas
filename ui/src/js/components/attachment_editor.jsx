/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var t = require('i18n!attachment_editor');
  var Dropzone = require('dropzone');
  var Notifier = require('modules/notifier');
  var RSVP = require('rsvp');
  var analytics = require('actions/analytics');

  var AttachmentEditor = React.createClass({
    propTypes: {
      onUpload: React.PropTypes.func.isRequired,
      onRemove: React.PropTypes.func.isRequired
    },

    getDefaultProps: function() {
      return {
        isNew: false,
        uploadUrl: null,
        attachments: [],
      };
    },

    componentDidMount: function() {
      this.dz = new Dropzone(this.refs.dropzone.getDOMNode(), {
        url: '/',
        withCredentials: true,
        accept: this.onUpload,
        paramName: 'item'
      });

      this.dz.on('success', this.onUploadComplete);
      this.dz.on('error', this.onUploadError);
    },

    componentDidUpdate: function(/*prevProps, prevState*/) {
      var isNew = this.props.isNew;

      if (isNew) {
        this.dz.disable();
      }
      else {
        this.dz.enable();
        this.dz.options.url = this.props.uploadUrl;
      }
    },

    componentWillUnmount: function() {
      this.dz.destroy();
      this.dz = undefined;
    },

    render: function() {
      return(
        <div id="attachment_editor" disabled={this.props.isNew}>
          {this.props.isNew &&
            <div className="alert alert-warning">
              {t('errors.must_save_first', 'Attachments are allowed only for saved transactions.')}
            </div>
          }

          <div ref="dropzone" className="dropzone"></div>

          {!this.props.isNew &&
            <ol>
              {this.props.attachments.map(this.renderAttachment)}
            </ol>
          }
        </div>
      );
    },

    renderAttachment: function(attachment) {
      return (
        <li key={'attachment-'+attachment.id}>
          <a href={attachment.links.item}>{attachment.fileName}</a>
          <button
            className="btn-a11y delete-attachment"
            onClick={this.removeAttachment.bind(null, attachment.id)}>
            <i className="icon-minus-circle"></i>
          </button>
        </li>
      );
    },

    onUpload: function(file, done) {
      if (this.props.attachments.length < 3) {
        done();
      } else {
        analytics.attachmentLimitExceeded();
        done(t('errors.max_files_exceeded'));
      }
    },

    onUploadComplete: function(file, responseText) {
      var notice = this.props.onUpload(file, responseText);

      analytics.uploadAttachment(file.type, file.size);

      RSVP.Promise.cast(notice).then(function() {
        Notifier.info(t('notifications.upload_complete', 'Upload complete.'));
      });
    },

    onUploadError: function(file, errorMessage/*, xhrResp*/) {
      analytics.uploadAttachmentFailed(errorMessage);
    },

    removeAttachment: function(attachmentId/*, e*/) {
      analytics.removeAttachment();

      this.props.onRemove(attachmentId);
    }
  });

  return AttachmentEditor;
});