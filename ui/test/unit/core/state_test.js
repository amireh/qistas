define([ 'core/state' ], function(State) {
  describe('Core::State', function() {
    it('should be creatable', function() {});

    it('should dump its own state', function() {
      expect( State.dump() ).toBeTruthy();
    });
  });
});