define(function(require) {
  var Keymapper = require('util/keymapper');
  var _ = require('underscore');
  var K = require('constants');
  var findBy = _.findWhere;

  /**
   * @class Core.InputManager
   */
  var InputManager = {};

  /**
   * @return {String}
   *         The keyboard combination for a given keybinding.
   */
  InputManager.shortcutFor = function(code) {
    var keyBinding = findBy(Keymapper.getKeyBindings(), { code: code });
    var key;

    if (keyBinding) {
      key = keyBinding.key;
    }
    else {
      console.warn('Keybinding with code "%s" was not found.', code);
      key = '';
    }

    return key.toUpperCase();
  };

  return InputManager;
});