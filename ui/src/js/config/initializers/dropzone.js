define(function(require) {
  var Dropzone = require('dropzone');
  var Config = require('config');
  var APIErrorDecorator = require('modules/api_error_decorator');
  var t = require('i18n!attachments/errors');

  Dropzone.autoDiscover = false;
  // Dropzone.prototype.defaultOptions.maxFilesize = 2;
  Dropzone.prototype.defaultOptions.uploadMultiple = false;
  Dropzone.prototype.defaultOptions.addRemoveLinks = true;
  Dropzone.prototype.defaultOptions.maxFiles = 3;
  // Dropzone.prototype.defaultOptions.acceptedFiles = 'image/*,application/pdf,text/*,application/html';
  Dropzone.prototype.defaultOptions.createImageThumbnails = false;

  Dropzone.prototype.defaultOptions.formatError = function(xhrError) {
    var error = xhrError;

    if (APIErrorDecorator.isError(error)) {
      error = APIErrorDecorator.parse(error);
    }
    else {
      error = {
        code: 'unknown',
        message: JSON.stringify(error)
      };
    }

    if (error.code && error.message) {
      return t(error.code, error.message);
    }
    else {
      return JSON.stringify(error);
    }
  };

  Dropzone.host = Config.apiHost;
});