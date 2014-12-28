define([ 'ext/jquery' ], function($) {
  return function() {
    return $.ajaxCORS.apply($, arguments);
  };
});