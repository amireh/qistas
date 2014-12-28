define([
  'ext/underscore',
  'ext/pixy'
], function(_, Pixy) {

  /**
   * @class  Pibi.Models.Category
   * @extends Pixy.DeepModel
   *
   * Category.
   *
   * @alternateClassName Category
   */
  return Pixy.DeepModel.extend({
    name: "Category",

    defaults: {
      name: '',
      icon: 'default'
    },

    validate: function(data) {
      var name = (data.name||'').toLowerCase(),
          id   = this.get('id');

      if (!data.name || !data.name.length) {
        return { name: '[CGRY_MISSING_NAME] You must provide a name for the category!' };
      }
      else if (data.name.length < 3) {
        return { name: '[CGRY_NAME_TOO_SHORT] A category must be at least 3 characters long.' };
      }

      // make sure it's unique
      var similarilyNamed = this.collection.find(function(c) {
        return !c.isNew() &&
          c.get('id') !== id &&
          c.get('name').toLowerCase() === name;
      });

      if ( similarilyNamed ) {
        return { name: '[CGRY_NAME_UNAVAILABLE] You already have such a category!' };
      }

      return false;
    },

    toString: function() {
      return [this.get('name'), this.get('id')].join('#');
    },

    parse: function() {
      var category = Pixy.DeepModel.prototype.parse.apply(this, arguments);

      if (!category.icon) {
        category.icon = (category.name || '').dasherize();
      }

      return category;
    }
  });
});