define([ 'ext/underscore', 'collections/transactions', 'models/recurring' ],
function(_, BaseCollection, Recurring) {

  /**
   * @class Pibi.Collections.Recurrings
   * @extends Pibi.Collections.Transactions
   * @alternateClassName RecurringsCollection
   *
   * A collection of recurring transactions.
   */
  return BaseCollection.extend({
    /**
     * @property {RecurringModel}
     */
    model: Recurring,

    journal: {
      scope: 'account',
      collection: 'recurrings',
      fetch_on_create: true
    },

    url: function() {
      return this.account.get('links.recurrings');
    },

    /**
     * Calculate the balance of the _active_ recurrings in the collection.
     * @override
     */
    balance: function(query, bunchOfModels) {
      query = _.extend({ active: true }, query);

      return BaseCollection.prototype.balance.apply(this, [ query, bunchOfModels ]);
    }
  });
});
