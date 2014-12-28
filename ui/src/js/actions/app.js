define([ 'core/dispatcher', 'constants' ],
function(Dispatcher, K) {
  return {
    setDateRange: function(from, to, format) {
      return Dispatcher.dispatch('app:setDateRange', {
        from: from,
        to: to,
        format: format
      });
    }
  };
});