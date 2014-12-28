define([ 'modules/backlog' ], function(Backlog) {
  describe('Modules::Backlog', function() {
    var backlog;

    beforeEach(function() {
      expect(function() {
        backlog = new Backlog();
      }).not.toThrow();
    });

    it('should track a recoverable action', function() {
      var x = 5;

      expect(function() {
        backlog.add({
          description: 'Change X',
          action: function() {
            x = 3;
          }
        });
      }).not.toThrow();
    });

    it('should undo a recoverable action', function() {
      var x = 5;

      expect(function() {
        backlog.add({
          description: 'Change X',
          action: function() {
            x = 3;
          }
        });
      }).not.toThrow();

      expect(x).toEqual(5);

      backlog.undo();

      expect(x).toEqual(3);
    });

    it('should undo a specific recoverable action', function() {
      var x = 5;
      var entryId;

      entryId = backlog.add({
        desc: 'Change X',
        action: function() {
          x = 3;
        }
      });

      backlog.add({
        desc: 'Change X again',
        action: function() {
          x = 6;
        }
      });

      expect(x).toEqual(5);

      expect(backlog.undo(entryId)).toBeTruthy();

      expect(x).toEqual(3);
    });

    it('should gracefully reject unavailable undos', function() {
      expect(backlog.length).toEqual(0);
      expect(backlog.undo()).toBeFalsy();
    });
  });
});