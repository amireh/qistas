define(function(require) {
  var _ = require('underscore');
  var Shortcut = require('shortcut');
  var Sanitize = require('util/sanitize');
  var t = require('i18n!key_bindings');
  var extend = _.extend;
  var result = _.result;
  var findBy = _.findWhere;

  /**
   * @class KeyBinding
   *
   * A descriptor for a single keybinding.
   *
   * @property {String} key
   *           The keyboard shortcut combination, in lowercase.
   *           This property is always present.
   *
   * @property {String} description
   *           An i18n-ized description of what the keybinding is for.
   *           This property is always present.
   *
   * @property {String} [context=undefined]
   *           Name of the context in which the keybinding works.
   *           This property *may* be present.
   *
   * @property {String} [code=undefined]
   *           A unique code for this keybinding that's used internally in the
   *           code (decoupled from the readable description). This code must
   *           be defined and references from the constant listing (see
   *           constants.js).
   */
  var keyBindings = [];

  /**
   * @internal
   */
  var installBinding = function(entry, thisArg) {
    Shortcut.add(entry.key, entry.callback, {
      context: thisArg,
      propagate: entry.options.propagate !== false
    });
  };

  /**
   * @internal
   */
  var removeBinding = function(entry, thisArg) {
    Shortcut.remove(entry.key, entry.callback, { context: thisArg });
  };

  /**
   * @internal
   */
  var parseDescription = function(description) {
    var i18nKey;

    if (typeof description === 'string' && description.match(/ns_[\w|_]+\./)) {
      i18nKey = description.split('.');
      i18nKey.shift();

      return t(i18nKey.join('.'));
    }
    else if (typeof description === 'function') {
      return description();
    }
    else {
      return description;
    }
  };

  /**
   * @class Util.Keymapper
   * @inheritable
   *
   * Keyboard connector module. Can be mixed-in by any module to conveniently
   * bind keys to actions.
   */
  var Keymapper = {
    buildKeymap: function(uniqueId, thisArg) {
      var keys = this.keys || [];

      // The callbacks are expected to be registered on the binding context
      // (this) and not necessarily @thisArg which is the case in React
      // components that provide auto-binding of callbacks, so they pass
      // a thisArg of `null` and we only need to reference the callback using
      // something like:
      //
      //     var callback = this[callbackId];
      //
      // Otherwise, we'll manually bind the callback:
      //
      //     var callback = this[callbackId].bind(this);
      var that = this;

      if (!Array.isArray(keys)) {
        throw new Error("Expected keys to be an array of keybinding specs.");
      }

      // build keybindings:
      this.keyBindings = keys.map(function(def) {
        var callback = that[def.action];

        return {
          key: def.key,
          description: parseDescription(def.description || ''),
          callback: thisArg ? callback.bind(thisArg) : callback,
          code: def.code,
          context: def.context,
          options: def.options || {}
        };
      });

      // register the keybindings in the global tracker:
      this.keyBindings.forEach(function(keyBinding) {
        keyBindings.push({
          key: keyBinding.key,
          code: keyBinding.code,
          description: keyBinding.description,
          context: keyBinding.context
        });
      });

      return this.keyBindings;
    },

    bindKeys: function() {
      var thisArg = this._keymapperContext;

      if (!this.keyBindings) {
        return;
      }

      this.unbindKeys();
      this.keyBindings.forEach(function(keyBinding) {
        installBinding(keyBinding, thisArg);
      });

      return this;
    },

    unbindKeys: function() {
      var thisArg = this._keymapperContext;

      if (!this.keyBindings) {
        return;
      }

      this.keyBindings.forEach(function(keyBinding) {
        removeBinding(keyBinding, thisArg);
      });

      return this;
    },
  };

  var exports = function(object, uniqueId, context) {
    if (!uniqueId) {
      throw new Error('Keymapper objects must have a unique id!');
    }

    if (arguments.length === 2) {
      context = object;
    }

    extend(object, Keymapper, {
      _keymapperContext: context
    });

    object.buildKeymap(uniqueId, context);

    return object;
  };

  /**
   * @return {KeyBinding[]}
   *         All registered key bindings.
   */
  exports.getKeyBindings = function() {
    return keyBindings;
  };

  return exports;
});