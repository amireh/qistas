define(function(require) {
  var SessionStore = require('stores/sessions');
  var K = require('constants');
  var RealtimeStore = require('stores/realtime');
  var UserStore = require('stores/users');
  var RSVP = require('rsvp');
  var Dispatcher = require('core/dispatcher');

  describe('Stores.Sessions', function() {
    var session = SessionStore;
    var store = session;
    var onChange, onError;

    this.promiseSuite = true;
    this.serverSuite = true;
    this.storeSuite();

    beforeEach(function() {
      onChange = jasmine.createSpy('onChange');
      onError = jasmine.createSpy('onError');
      spyOn(RealtimeStore, 'connect').and.returnValue(RSVP.resolve());
      SessionStore.reset();
    });

    describe('#fetch', function() {
      it('should activate on a successful fetch', function() {
        this.respondWith('GET', '/users/self', Fixtures.XHR(200, {
          id: 3
        }));

        expect(session.isActive()).toBeFalsy();
        expect(session.getUserId()).toBeFalsy();

        session.fetch().catch(onError);
        this.respond();

        expect(onError).not.toHaveBeenCalled();
        expect(session.getUserId()).toEqual(3);
        expect(session.isActive()).toBeTruthy();
      });

      it('should not activate on a failed fetch', function() {
        this.respondWith('GET', '/users/self', Fixtures.XHR(400));

        expect(session.isActive()).toBeFalsy();
        expect(session.getUserId()).toBeFalsy();

        session.fetch().catch(onError);
        this.respond();

        expect(onError).toHaveBeenCalled();

        expect(session.getUserId()).toBeFalsy();
        expect(session.isActive()).toBeFalsy();
      });

      xit('should clear when authenticating as a new user', function() {
        this.respondWith('GET', '/users/self', Fixtures.XHR(200, {
          id: 3
        }));

        expect(session.isActive()).toBeFalsy();
        expect(session.getUserId()).toBeFalsy();

        session.fetch().catch(onError);
        this.respond();

        expect(onError).not.toHaveBeenCalled();
        expect(session.getUserId()).toEqual(3);
        expect(session.isActive()).toBeTruthy();

        this.reloadServer();
        this.respondWith('GET', '/users/self', Fixtures.XHR(200, {
          id: 5
        }));

        session.fetch().catch(onError);
        this.respond();

        expect(onError).not.toHaveBeenCalled();
        expect(session.getUserId()).toEqual(5);
        expect(session.isActive()).toBeTruthy();
      });
    });

    describe('session:login', function() {
      it('should activate on a successful save', function() {
        this.respondWith('GET', '/users/self', Fixtures.XHR(200, {
          id: 3
        }));

        expect(session.isActive()).toBeFalsy();
        expect(session.getUserId()).toBeFalsy();

        this.dispatch('session:login', {}, onChange, onError);
        this.respond();

        expect(onChange).toHaveBeenCalled();
        expect(session.getUserId()).toEqual(3);
        expect(session.isActive()).toBeTruthy();
      });

      it('should not activate on a failed save', function() {
        this.respondWith('GET', '/users/self', Fixtures.XHR(400));

        expect(session.isActive()).toBeFalsy();
        expect(session.getUserId()).toBeFalsy();

        this.dispatch('session:login', {
          email: 'demo@pibiapp.com',
          password: 'hi123456'
        }, onChange, onError);

        this.respond();

        expect(onError).toHaveBeenCalled();
        expect(session.getUserId()).toBeFalsy();
        expect(session.isActive()).toBeFalsy();
      });
    });

    describe('#destroy', function() {
      it('should deactivate on a successful destroy', function() {
        this.respondWith('DELETE', '/sessions', Fixtures.XHR(204));

        this.dispatch('session:logout', {}, onChange);
        this.respond();

        expect(onChange).toHaveBeenCalled();
        expect(store.isActive()).toBeFalsy();
      });
    });

    xit('should emit change when a user signs up', function() {
      SessionStore.addChangeListener(onChange);
      UserStore.emitActionSuccess('users:signup', 1);

      expect(onChange).toHaveBeenCalled();
    });
  });
});