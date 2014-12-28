define([ 'ext/underscore', 'ext/pixy', 'models/category' ], function(_, Pixy, Category) {
  /**
   * @class  Pibi.Collections.Categories
   * @extends Pixy.Collection
   *
   * User categories, aka tags.
   *
   * @alternateClassName Categories
   */
  var Categories = Pixy.Collection.extend({
    id: 'CategoriesCollection',
    model: Category,

    journal: {
      scope:      'user',
      collection: 'categories'
    },

    url: function() {
      return this.user.get('links.categories');
    },

    comparator: function(model) {
      return((model.get('name') || '').toLowerCase());
    }
  });

  return Categories;
});
