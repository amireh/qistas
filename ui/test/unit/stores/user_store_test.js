/* global onChange:true, onError: true */

define(function(require) {
  var Subject = require('stores/users');

  describe('Stores.Users', function() {
    this.storeSuite();
    this.serverSuite = true;

    describe('users:signup', function() {
      it('should work', function() {
        var body;
        var params = {
          name: 'Ahmad',
          email: 'ahmad@algollabs.com',
          password: 'foobar123',
          subscribe: false
        };

        this.respondWith('POST', '/users', Fixtures.XHR(200, { id: '1' }));
        this.dispatch('users:signup', params).then(onChange, onError);

        this.respond();
        expect(this.server.requests[0].url).toBe('/users');
        expect(this.server.requests[0].method).toBe('POST');
        body = JSON.parse(this.server.requests[0].requestBody);
        expect(body.name).toBe(params.name)
        expect(body.email).toBe(params.email)
        expect(body.password).toBe(params.password)
        expect(body.password_confirmation).toBe(params.password)
        expect(body.subscribe).toBe(params.subscribe)
      });
    });
  });
});