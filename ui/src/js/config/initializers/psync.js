define(function(require) {
  var Psync = require('psync');
  var currentUser = require('core/current_user');
  var adapter = Psync.Adapters.Pixy;

  Psync.configure('enabled', true);
  Psync.configure('adapter', adapter);
  Psync.configure('unrecoverableResponseCodes', [ 400, 422 ]);
  Psync.configure('ignoreSingularResources', true);
  Psync.configure('rootScope', {
    users: currentUser.collection,
    accounts: currentUser.accounts,
    payment_methods: currentUser.paymentMethods,
    categories: currentUser.categories,
  });
});