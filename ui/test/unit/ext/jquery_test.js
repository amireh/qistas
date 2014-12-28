define([ 'ext/jquery', 'rsvp' ], function($, RSVP) {
  describe('Vendor Extensions', function() {
    describe('jQuery', function() {
      this.serverSuite = true;

      describe('$.ajaxCORS', function() {
        it('should execute callbacks in custom thisArg context', function() {
          var listener = new Fixtures.Listener();
          var context;

          listener.a = function() {
            context = this;
          };

          spyOn(listener, 'a').and.callThrough();

          $.ajaxCORS({
            url: '/pulse',
            complete: function() {
              this.a();
            }
          }, listener);

          this.respond();

          expect(listener.a).toHaveBeenCalled();
          expect(context).toEqual(listener);
        });
      });

      describe('application/json.cached', function() {
        it('should return a cached response', function() {
          var query = $.ajax({
            transport: 'localStorage',
            data: { foo: "bar" }
          });

          query.then(function(response) {
            expect(response).toEqual({ foo: "bar" });
          });

          this.respond();
        });

        it('should fail when there is no cached response', function() {
          var query = $.ajax({
            transport: 'localStorage',
            data: null
          });

          var onSuccess = jasmine.createSpy('success');
          var onFailure = jasmine.createSpy('fail');

          query.then(onSuccess, onFailure);

          this.respond();

          expect(onSuccess).not.toHaveBeenCalled();
          expect(onFailure).toHaveBeenCalled();
        });
      });
    });
  });
});