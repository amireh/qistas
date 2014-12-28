define([ 'ext/pixy', 'models/budget' ], function(Pixy, Budget) {
  /**
   * @class  Pibi.Collections.Budgets
   * @extends Pixy.Collection
   *
   * User budgets collection, sorted by their name.
   */
  return Pixy.Collection.extend({
    id: 'BudgetsCollection',
    model: Budget,

    url: function() {
      return this.user.get('links.budgets');
    },

    comparator: function(model) {
      return (model.get('name') || '').toLowerCase();
    }
  });
});