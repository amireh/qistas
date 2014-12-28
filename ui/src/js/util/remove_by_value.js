define(function() {
  /** @internal Remove a record. */
  return function removeByValue(record, set) {
    var index;

    if (set) {
      index = set.indexOf(record);

      if (index !== -1) {
        set.splice(index, 1);

        return true;
      }
    }
  };
});