define(function(require) {
  var RSVP = require('rsvp');

  RSVP.configure('onerror', function(e) {
    console.error(">>> Error caught in async promise handler. <<<");

    if (e.stack) {
      console.error(e.stack);
    }
    else {
      console.error(e);
    }
  });

  return {
  };
});
