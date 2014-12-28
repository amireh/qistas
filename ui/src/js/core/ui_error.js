define(function() {
  var UIError = function(params) {
    this.name = 'UIError';
    this.code = params.code;
    this.message = params.message || 'Generic UI error.';
    this.details = params.details;
    this.fieldErrors = params.fieldErrors;
  };

  UIError.prototype = Error.prototype;

  return UIError;
});