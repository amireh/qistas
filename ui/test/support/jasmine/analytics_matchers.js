/* global jasmine: false */
define([ 'underscore', 'modules/analytics' ], function(_, Analytics) {
  var currentSuite;

  var slice = [].slice;
  var template = function() {
    var fragments = slice.call(arguments);

    return _.template(fragments.join(' '), null, {
      interpolate: /\${([\s\S]+?)}/g
    });
  };

  var parseAnalyticsEvent = function(details) {
    var params = {};

    if (typeof details === 'string') {
      params.name = details;
    }
    else if (details instanceof Array) {
      params.name = details[0];
      params.properties = details[1];
    }
    else {
      if (!details.name) {
        throw new Error("Calling #toSubmitAnalytics() with an object requires a 'name' field.");
      }
      else if (!details.properties) {
        throw new Error("Calling #toSubmitAnalytics() with an object requires a 'properties' field.");
      }

      params = details;
    }

    return params;
  };

  var Matchers = {
    toSubmitAnalytics: function() {
      return {
        compare: function(callback, details) {
          var result = {};
          var params = parseAnalyticsEvent(details);
          var adapter = Analytics.adapter;
          var trackEvent = spyOn(adapter, 'trackEvent').and.callThrough();
          var event;

          callback.call(currentSuite);

          // Was any event tracked at all?
          result.pass = trackEvent.calls.count() > 0;

          // Was it the expected event?
          if (result.pass) {
            event = adapter.events[adapter.events.length-1];

            if (params.name !== event.name) {
              result.pass = false;
              result.message = "Expected event name to be '" + params.name + "', but it was: '" + event.name + "'";
            }
            else if (!!params.properties) {
              expect(params.properties).toEqual(event.properties);
            }
          }

          return result;
        }
      }
    }
  };

  return {
    matchers: Matchers,
    install: function(suite, subject) {
      currentSuite = suite;
      jasmine.addMatchers(Matchers);
    }
  };
});