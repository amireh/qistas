define([ 'ext/pixy', 'models/account' ], function(Pixy, Account) {
  /**
   * @class  Pibi.Collections.Accounts
   * @extends Pixy.Collection
   *
   * User accounts.
   *
   * @alternateClassName Accounts
   */
  return Pixy.Collection.extend({
    id: 'AccountsCollection',
    model: Account,

    journal: {
      scope: 'user',
      collection: 'accounts'
    },

    url: function() {
      return this.user.get('links.accounts');
    },

    comparator: function(model) {
      return (model.get('label') || '').toLowerCase();
    }
  });
});