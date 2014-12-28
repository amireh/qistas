define(function(require) {
  var ResourceManagerMixin = require('mixins/stores/resource_manager');
  var Pixy = require('pixy');
  var Store = Pixy.Store;
  var Collection = Pixy.Collection;
  var Dispatcher = require('core/dispatcher');

  describe('Mixins.Stores.ResourceManager', function() {
    var onChange, onError;

    var TestStore = new Store('tests', {
      collection: new Pixy.Collection(),
      actions: {
        add: ResourceManagerMixin.add,
        save: ResourceManagerMixin.save,
        remove: ResourceManagerMixin.remove,
      }
    });

    this.storeSuite();

    beforeEach(function() {
      onChange = jasmine.createSpy('onChange');
      onError = jasmine.createSpy('onError');
    });

    describe('#add', function() {
      it('should yield with a new model', function() {
        this.dispatch('tests:add', {}).then(onChange, onError);
        this.flush();

        expect(onChange).toHaveBeenCalled();
        expect(onError).not.toHaveBeenCalled();
      });
    });

    describe('#save', function() {
    });
  });
});