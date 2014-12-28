define(function() {
  return function wrapArray(arr) {
    return Array.isArray(arr) ?
      arr :
      arr ?
        [ arr ] :
        [];
  };
});