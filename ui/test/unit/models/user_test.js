define([ 'models/user', 'json!fixtures/user' ], function(User, UserData) {
  describe('Models::User', function() {
    var user;

    beforeEach(function() {
      Fixtures.Currency('EUR', 2);
      expect(function() {
        user = new User();
      }).not.toThrow();
    });

    it('should be creatable', function() {});
    it('should be clearable', function() {
      expect(function() {
        user.clear();
      }).not.toThrow();
    });

    describe('#parse', function() {
      it('should load payment methods', function() {
        var setRc = user.parse({
          users: [{ id: 1, payment_method_ids: [ 1, 2 ]}],
          payment_methods: [
            {
                "id": 1,
                "name": "Cash",
                "color": "00FF00",
                "default": true
            },
            {
                "id": 2,
                "name": "Credit Card",
                "color": "FF0000"
            }
          ]
        }, { parse: true });

        expect(setRc).toBeTruthy();
        expect(user.paymentMethods.length).toEqual(2);
      });
      it('should load categories', function() {
        var setRc = user.parse({
          users: [{ id: 1, category_ids: [ 1, 2, 3 ]}],
          categories: [
            {
                "id": 1,
                "name": "Bills",
                "icon": "bills"
            },
            {
                "id": 2,
                "name": "Gas",
                "icon": "gas-pump"
            },
            {
                "id": 3,
                "name": "House",
                "icon": "household"
            }
          ]
        }, { parse: true });

        expect(setRc).toBeTruthy();
        expect(user.categories.length).toEqual(3);
      });

    });

    describe('#defaultPaymentMethod', function() {
      it('should locate the default payment method', function() {
        user.paymentMethods.add([ { name: 'A' }, { name: 'B', default: true }]);

        expect(user.defaultPaymentMethod()).toBeTruthy();
        expect(user.defaultPaymentMethod().get('name')).toEqual('B');
      });

      it('should locate any payment method', function() {
        user.paymentMethods.add([ { name: 'A' }, { name: 'B' }]);

        expect(user.defaultPaymentMethod()).toBeTruthy();
        expect(user.defaultPaymentMethod().get('name')).toEqual('A');
      });
    });

    describe('Preferences', function() {
      var server;

      beforeEach(function() {
        server = sinon.fakeServer.create();
      });

      afterEach(function() {
        server.restore();
      });

      it('should locate a preference', function() {
        expect(user.preference('dateFormat')).toEqual('DD[/]MM[/]YYYY');
      });

      it('should save preferences', function() {
        var saved = false;

        server.respondWith('PATCH', '/users/1', Fixtures.FakeResponse(200, {
          fruit: 'apple'
        }));

        user.set(UserData);
        user.savePreferences({ fruit: 'apple' }, {
          success: function() { saved = true; }
        });

        server.respond();

        expect(saved).toBeTruthy();
        expect(user.preference('fruit')).toEqual('apple');
      });
    });

    describe('Account management', function() {
      beforeEach(function() {
        // sink the calls to savePreferences when the user adds the currency of
        // the newly added accounts to its list
        spyOn(user, 'savePreferences');
      });

      it('should start with a blank account', function() {
        expect(user.accounts.length).toEqual(1);
      });

      it('should use the first account as the active one if none is set', function() {
        var account = user.accounts.first();

        expect(user.getActiveAccount()).toBeTruthy();
        expect(user.getActiveAccount()).toEqual(account);
      });

      it('should activate an account', function() {
        var account1 = user.accounts.first();
        var account2 = user.accounts.add({}).last();

        expect(user.getActiveAccount()).toEqual(account1);

        expect(function() {
          user.setActiveAccount(account2)
        }).not.toThrow();

        expect(user.getActiveAccount()).toEqual(account2);
      });

      it('should re-activate when active account is removed', function() {
        var account1 = user.accounts.first();
        var account2 = user.accounts.add({}).last();

        expect(user.getActiveAccount()).toEqual(account1);

        user.accounts.remove(account1);

        expect(user.getActiveAccount()).toEqual(account2);
      });
    });

    describe('Currency management', function() {
      beforeEach(function() {
        Fixtures.Currency('JOD', 0.71);
        Fixtures.Currency('EUR', 0.73);
      });

      it('should start with default currencies', function() {
        expect(user.currenciesByISO().length).toEqual(2);
      });

      it('should add a currency', function() {
        spyOn(user, 'savePreferences');

        expect(function() {
          user.addCurrency('JOD');
        }).not.toThrow();

        expect(user.savePreferences.calls.mostRecent().args[0]).toEqual({
          currencies: [ 'EUR', 'JOD', 'USD' ]
        });
      });

      it('should reject adding an unknown currency', function() {
        expect(function() {
          user.addCurrency('JPY');
        }).toThrow(new TypeError('Unknown currency JPY'));
      });

      it('should remove a currency', function() {
        spyOn(user, 'savePreferences');

        expect(function() {
          user.removeCurrency('USD');
        }).not.toThrow();

        expect(user.savePreferences).toHaveBeenCalled();
        expect(user.savePreferences.calls.mostRecent().args[0]['currencies']).
          toEqual(['EUR']);
      });

      it('should replace currency list', function() {
        spyOn(user, 'savePreferences');

        expect(function() {
          user.setCurrencies([ 'EUR' ]);
        }).not.toThrow();

        expect(user.savePreferences).toHaveBeenCalled();
        expect(user.savePreferences.calls.mostRecent().args[0]['currencies']).
          toEqual(['EUR']);
      });

      it('should automatically adds USD if no currency is selected', function() {
        spyOn(user, 'savePreferences');

        expect(function() {
          user.setCurrencies([]);
        }).not.toThrow();

        expect(user.savePreferences).toHaveBeenCalled();
        expect(user.savePreferences.calls.mostRecent().args[0]['currencies']).
          toEqual(['USD']);
      });

      it('should automatically add an account currency', function() {
        expect(user.currenciesByISO().indexOf('JOD')).toEqual(-1);

        spyOn(user, 'savePreferences');

        user.accounts.add({ currency: 'JOD' });

        expect(user.savePreferences).toHaveBeenCalled();
        expect(user.savePreferences.calls.mostRecent().args[0]['currencies'].
            length).toEqual(3);
      });
    });
  });
});