define(function(require) {
  var Pixy = require('ext/pixy');
  var _ = require('underscore');
  var RSVP = require('rsvp');
  var User = require('core/current_user');
  var ResourceManagerMixin = require('mixins/stores/resource_manager');
  var analytics = require('actions/analytics');

  var store;

  store = new Pixy.Store('categories', {
    collection: null,

    initialize: function() {
      this.reset();
    },

    getAll: function() {
      return this.collection.toProps();
    },

    actions: {
      add: ResourceManagerMixin.add,
      save: function(params, onChange, onError) {
        if (!params.icon || String(params.icon).length === 0) {
          params.icon = 'default';
        }

        ResourceManagerMixin.save.call(this, params, onChange, onError)
      },

      remove: ResourceManagerMixin.remove
    },

    reset: function() {
      this.collection = User.categories;
    },

    onResourceSaved: function(model, attrs, options) {
      if (options.patch) {
        analytics.updateCategory(attrs.name, attrs.icon);
      }
      else {
        analytics.createCategory(attrs.name, attrs.icon);
      }
    },

    onResourceSaveFailure: function(model, attrs, options, error) {
      if (options.patch) {
        analytics.updateCategoryFailed(error);
      }
      else {
        analytics.createCategoryFailed(error);
      }
    },

    onResourceRemoved: function(model, wasNew) {
      this.trigger('remove', ''+model.get('id'));

      if (!wasNew) {
        analytics.removeCategory();
      }
    },

    onResourceRemoveFailure: function(model, error) {
      analytics.removeCategoryFailed(error);
    }
  });

  return store;
});