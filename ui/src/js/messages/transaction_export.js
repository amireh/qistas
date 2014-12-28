define(function(require) {
  var Messenger = require('core/messenger');
  var ActionCenter = require('stores/action_center');
  var OperationCenter = require('stores/operations');
  var t = require('i18n!notification_center');

  Messenger.addHandler('transaction_export', function(message, selfOrigin) {
    var downloadUrl = message.download_url;
    var notification;

    if (!selfOrigin) {
      return;
    }

    notification = t.htmlSafe('transaction_export', {
      defaultValue:
        'Your CSV transaction file is ready for download.' +
        'Click <a href="__downloadUrl__">here</a>.',
      downloadUrl: downloadUrl
    });

    ActionCenter.notify(notification);
    OperationCenter.markComplete(message.progress_id);

    window.location.href = downloadUrl;

    return true;
  });
});