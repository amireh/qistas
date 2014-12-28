define(function() {
  return function createFormError(field, code, message) {
    var error;

    error = { fieldErrors: {} };
    error.fieldErrors[field] = {
      code: code,
      message: message
    };

    return error;
  };
});