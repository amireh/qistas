define(function(require) {
  var ajax = require('core/ajax');
  var config = require('config');
  var env = require('core/environment');
  var _ = require('underscore');
  var Promise = require('core/promise');
  var extend = _.extend;

  var dumpLocalStorage = function() {
    var dump;

    try {
      dump = Object.keys(localStorage).reduce(function(dump, key) {
        if (localStorage.hasOwnProperty(key)) {
          dump[key] = localStorage.getItem(key);
        }

        return dump;
      }, {});
    }
    catch(e) {
      dump = null;
    }

    return dump;
  };

  /**
   * @method
   *
   * Dumps useful information from a JavaScript Error exception into a JSON construct.
   *
   * @param  {Error} e
   * A JavaScript Error object.
   *
   * @return {Object}
   * The JSONified error.
   */
  var dumpError = function(e) {
    return {
      type: e.type,
      name: e.name,
      message: e.message,
      stack: e.stack
    };
  };

  var buildReport = function(message, errorObject, additionalContext) {
    var report = extend({}, additionalContext);

    report.message = message;
    report.currentUrl = window.location.href;
    report.queryParams = env.query;
    report.userAgent = navigator.userAgent;
    report.platform = navigator.platform;
    report.error = dumpError(errorObject || new Error());
    report.localStorage = dumpLocalStorage();

    return report;
  };

  var ErrorReport = function(message, errorObject, additionalContext) {
    return new Promise(function(resolve, reject) {
      var report;

      console.info('Submitting an error report...');

      try {
        report = buildReport(message, errorObject, additionalContext);
      } catch(e) {
        console.warn('Error report generation failed!', e.stack);
        return reject(e);
      }

      ajax({
        url: config.errorSubmissionUrl,
        type: 'POST',
        data: JSON.stringify(report)
      }).then(resolve, reject);
    });
  };

  return ErrorReport;
});