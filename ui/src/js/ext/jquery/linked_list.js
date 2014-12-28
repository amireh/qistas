define([ 'jquery' ], function($) {
  'use strict';

  var LinkedList = function(set) {
    this.$set = $(set);
    this.setCursor(0);

    return this;
  };

  $.extend(LinkedList.prototype, {
    set: function() {
      return this.$set;
    },

    setCursor: function(cursor) {
      if (cursor instanceof jQuery) {
        cursor = this.$set.index( cursor );
      }

      this.cursor = cursor;
      this.$cursor = $(this.$set.get(this.cursor));

      return this;
    },

    next: function(originalCursor) {
      if (originalCursor) {
        this.setCursor(originalCursor);
      }

      this.setCursor(this.hasNext() ? this.cursor + 1 : 0);

      return this.$cursor;
    },

    hasNext: function() {
      if (this.$set.length === 1) {
        return false;
      }

      if (this.cursor + 1 === this.$set.length) {
        return false;
      }

      return true;
    },

    prev: function(originalCursor) {
      if (originalCursor) {
        this.setCursor(originalCursor);
      }

      var prevCursor = this.cursor - 1;

      if (this.$set.length === 1) {
        prevCursor = 0;
      }

      this.setCursor(prevCursor);

      return this.$cursor;
    },

    hasPrev: function() {
      return !(this.$set.length === 1 || this.cursor === 0);
    }
  });

  $.fn.linkedList = function() {
    return new LinkedList(this);
  }
});