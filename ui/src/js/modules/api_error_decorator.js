define([ 'underscore' ], function(_) {
  function extractParts(rawMessage) {
    var fragments = rawMessage.match(/^\[(.*)\][:|\s]*(.*)/) || [];
    var code = fragments[1];
    var message = fragments[2] || rawMessage;

    if (code) {
      code = code.replace(/:/g, '_');
    }

    if (message) {
      message = message.trim();
    }

    return { code: code, message: message };
  }

  return {
    isError: function(json) {
      return json && json.status === 'error';
    },

    parse: function(apiError) {
      var error = {
        message: undefined,
        code: undefined,
        fieldErrors: {}
      };

      if (_.isArray(apiError.messages) && apiError.messages[0]) {
        _.extend(error, extractParts(apiError.messages[0]));
      }

      _.each(_.pairs(apiError.field_errors), function(pair) {
        var field = pair[0];
        var fieldErrors = pair[1];

        error.fieldErrors[field] = extractParts(fieldErrors[0]);
      });

      return error;
    }
  };
});