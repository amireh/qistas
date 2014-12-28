define(function(require) {
  var _ = require('ext/underscore');
  var getStatics = require('util/react/get_statics');

  var findBy = _.findBy;
  var extend = _.extend;
  var isObject = _.isObject;

  var getIdProp = function(component) {
    return getStatics(component).itemIdProp;
  };

  var getCollectionProp = function(component) {
    return getStatics(component).itemCollectionProp;
  };

  /**
   * @class Mixins.Components.Editor
   *
   * Utility mixin for components that allow editing of models.
   */
  var EditorMixin = {
    componentWillMount: function() {
      if (!this.shouldItemActivate) {
        this.shouldItemActivate = function() { return true; }
      }
    },

    componentDidMount: function() {
      var id = this.props[getIdProp(this)];

      if (id) {
        this.activateItem(this.props, this.props);
      }
    },

    componentWillReceiveProps: function(nextProps) {
      var lastId = this.state.activeId;
      var newId = nextProps[getIdProp(this)];

      if (newId !== lastId || this.__forcedItemReactivation) {
        this.__forcedItemReactivation = false;
        this.activateItem(nextProps, this.props);
      }
    },

    activateItem: function(props, lastProps) {
      var lastId, lastItem, newId, newItem;
      var idProp = getIdProp(this);
      var collectionProp = getCollectionProp(this);
      var getItem = function(srcProps, id) {
        var collection = srcProps[collectionProp];
        return findBy(collection, { id: id });
      };

      lastId = this.state.activeId;
      lastItem = getItem(lastProps, lastId);

      newId = props[idProp];
      newItem = getItem(props, newId);

      if (this.shouldItemActivate(lastItem, newItem)) {
        this.setState({ activeId: newId });
        this.itemDidActivate(newItem);
      }
    },

    reactivateItem: function() {
      var activeItem = this.getActiveItem();

      if (activeItem) {
        this.__forcedItemReactivation = true;
        // this.itemDidActivate(activeItem);
      }
    },

    getActiveItemId: function() {
      return this.state.activeId;
    },

    getActiveItem: function() {
      var collection = this.props[getCollectionProp(this)];
      return findBy(collection, { id: this.getActiveItemId() });
    },
  };

  return EditorMixin;
});