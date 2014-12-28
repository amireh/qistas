define(function(require) {
  var Pixy = require('pixy');
  var APIErrorDecorator = require('modules/api_error_decorator');
  var keys = Object.keys;

  /**
   * Simulate a local Model error into a form of an API 400 response,
   * so that the handlers don't have to differentiate between local and remote
   * errors.
   */
  Pixy.Model.prototype.formatValidationError = function(validationError) {
    var error = keys(validationError).reduce(function(error, field) {
      var fieldError = validationError[field];

      error.messages.push(fieldError);

      if (!error.field_errors.hasOwnProperty(field)) {
        error.field_errors[field] = [];
      }

      error.field_errors[field].push(fieldError);

      return error;
    }, {
      status: 'error',
      messages: [],
      field_errors: {}
    });

    return APIErrorDecorator.parse(error);
  };

  return Pixy.Model;
});