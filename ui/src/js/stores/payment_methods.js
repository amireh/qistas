define(function(require) {
  var Pixy = require('ext/pixy');
  var ResourceManagerMixin = require('mixins/stores/resource_manager');
  var User = require('core/current_user');
  var analytics = require('actions/analytics');

  var store;

  store = new Pixy.Store('paymentMethods', {
    getInitialState: function() {
      return {
        collection: User.paymentMethods,
        activeId: null
      };
    },

    getAll: function() {
      return this.state.collection.toProps();
    },

    getActiveId: function() {
      return this.state.activeId;
    },

    add: function() {
      ResourceManagerMixin.add.call(this, null, function(props) {
        this.state.activeId = props.id;
      }.bind(this))
    },

    actions: {
      activate: function(id, onChange) {
        if (this.state.collection.get(id) && this.state.activeId !== id) {
          this.setState({ activeId: id });
        }
      },

      add: function(__payload, onChange) {
        this.add();
        onChange();
      },

      save: function(newAttrs, onChange, onError) {
        var activeItem, payload;

        if (!this.state.activeId) {
          this.add();
        }

        activeItem = this.state.collection.get(this.state.activeId);

        if (!activeItem) {
          return onError("You must activate a payment method first.");
        }

        payload = newAttrs;
        payload.id = this.state.activeId;

        ResourceManagerMixin.save.call(this, payload, function(id) {
          this.state.activeId = id;
          onChange();
        }.bind(this), onError);
      },

      remove: function(__payload, onChange, onError) {
        var payload = { id: this.state.activeId };

        ResourceManagerMixin.remove.call(this, payload, function() {
          this.add();
          onChange();
        }.bind(this), onError);
      },
    },

    onResourceSaved: function(model, attrs, options) {
      if (options.patch) {
        analytics.updatePaymentMethod(attrs.name, attrs.color);
      }
      else {
        analytics.createPaymentMethod(attrs.name, attrs.color);
      }
    },

    onResourceSaveFailure: function(model, attrs, options, error) {
      if (options.patch) {
        analytics.updatePaymentMethodFailed(error);
      }
      else {
        analytics.createPaymentMethodFailed(error);
      }
    },

    onResourceRemoved: function(model, wasNew) {
      this.trigger('remove', model.get('id'));

      analytics.removePaymentMethod();
    },

    onResourceRemoveFailure: function(model, error) {
      analytics.removePaymentMethodFailed(error);
    }
  });

  return store;
});