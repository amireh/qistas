define(function(require) {
  var clone = require('underscore').clone;
  var K = require('constants');
  var noop = require('util/noop');

  var ResourceManagerMixin = {
    add: function(_params, onChange) {
      var collection = this.collection || this.state.collection;
      var model = collection.findOrAddNew();
      var attrs = model._assignDefaults();

      attrs.id = K.NEW_MODEL_ID;
      model.clear({ silent: true });
      model.set(attrs, { silent: true });

      onChange(model.toProps());
    },

    save: function(params, onChange, onError) {
      var collection = this.collection || this.state.collection;
      var model = collection.get(params.id);
      var options = {};
      var attrs = clone(params || {});
      var onSave = (this.onResourceSaved || noop).bind(this);
      var onSaveFailure = (this.onResourceSaveFailure || noop).bind(this);

      if (!model && params.id) {
        return onError(K.ERROR_NOT_FOUND);
      }
      else if (!model) {
        model = collection.push({});
      }

      delete attrs.id;

      options.patch = !model.isNew();
      options.wait = true;
      options.validate = true;

      model.save(attrs, options).then(function() {
        if (collection.comparator) {
          collection.sort();
        }

        onSave(model, attrs, options);

        onChange(model.get('id'));
      }, function(error) {
        onSaveFailure(model, attrs, options, error);
        onError(error);
      });
    },

    remove: function(params, onChange, onError) {
      var collection = this.collection || this.state.collection;
      var model = collection.get((params || {}).id);
      var onRemove = (this.onResourceRemoved || noop).bind(this);
      var onRemoveFailure = (this.onResourceRemoveFailure || noop).bind(this);
      var wasNew;

      if (!model) {
        return onError(K.ERROR_NOT_FOUND);
      }

      wasNew = model.isNew();

      model.destroy({ wait: true }).then(function() {
        if (!wasNew) {
          onRemove(model);
        }

        onChange();
      }, function(error) {
        if (!wasNew) {
          onRemoveFailure(model, error);
        }

        onError(error)
      });
    }
  };

  return ResourceManagerMixin;
});