var global = this;

require([ 'core/dispatcher', 'test/support/jasmine/analytics_matchers' ], function(Dispatcher, AnalyticsMatchers) {
  jasmine.Suite.prototype.storeSuite = function(subject) {
    var suite = this;

    this.promiseSuite = true;
    this.beforeEach(function() {
      var onChange = global.onChange = jasmine.createSpy('onChange');
      var onError = global.onError = jasmine.createSpy('onError');

      AnalyticsMatchers.install(suite, subject);

      this.dispatch = function(action, payload, _onChange, _onError) {
        var svc = Dispatcher.dispatch(action, payload);

        svc.promise.then(_onChange || onChange, _onError || onError);

        if (this.respond) {
          this.respond();
        }
        else {
          this.flush();
        }

        return svc.promise;
      };
    });
  };
})