define(function(require) {
  var _ = require('ext/underscore');
  var convertCase = require('util/convert_case');
  var getStatics = require('util/react/get_statics');
  var pick = _.pick;
  var isEqual = _.isEqual;
  var extend = _.extend;
  var clone = _.clone;

  var getDraftPropKeys = function(component) {
    return getStatics(component).draftableProps.reduce(function(propKeys, item) {
      var key;

      if (typeof item === 'object') {
        key = item.key;
      }
      else {
        key = item;
      }

      return propKeys.concat(key);
    }, []);
  };

  var getDraftDefaults = function(component) {
    return getStatics(component).draftableProps.reduce(function(defaults, item) {
      if (typeof item === 'string') {
        defaults[item] = undefined;
      }
      else if (typeof item === 'object') {
        defaults[item.key] = clone(item.defaultValue);
      }

      return defaults;
    }, {});
  };

  /**
   * @class Mixins.Components.DraftState
   *
   * This mixin allows the host component to maintain a "draft copy" of a
   * certain object for editing purposes. This allows for batched-updates to
   * models, bypassing the one-way data flow.
   *
   * Drafts provide you with the ability to easily tell whether the user has
   * actually made any modifications which you can utilize to confirm before
   * discarding changes.
   *
   * == How to use
   *
   * 1. Define draft props
   *
   * You must explicitly specify the names of the properties you wish to draft
   * from the base version. Do so in statics.draftableProps:
   *
   *     statics: {
   *       draftableProps: [
   *         'name',
   *         'color'
   *       ]
   *     }
   *
   * 2. Prepare draft
   *
   * You generate a new draft every-time you're editing a specific model.
   * Your host component's state should contain the new draft.
   *
   *     componentDidUpdate: function() {
   *       if (modelHasChanged) {
   *         this.setState(this.generateDraft(this.props));
   *       }
   *     }
   *
   * 3. Update
   *
   * You can use any React two-way binding addon to forward user input to the
   * draft (since the draft is really just a set of fields in your state).
   *
   *     <input valueLink={this.linkState('amount')} />
   *
   * 4. Commit or discard
   *
   * When the user chooses to, you get to commit the draft to the store to
   * update the model, or discard the changes
   *
   *     save: function() {
   *       var baseVersion; // get this from this.props or somewhere
   *       var draft = this.getDraft();
   *
   *       if (this.isDraftDirty(draft, baseVersion)) {
   *         if (!confirm('You are about to discard your changes. Proceed?')) {
   *           return;
   *         }
   *       }
   *
   *       this.sendAction('save', draft);
   *     }
   */
  var DraftStateMixin = {
    /**
     * @internal
     * A reference to the base version the latest draft was generated from.
     */
    __draftBase: undefined,

    /**
     * Generate a new draft from a base version. Only the draft props defined in
     * statics.draftableProps will be picked from the base version.
     *
     * @param  {Object} base
     *         The version of the document you wish to draft.
     *
     * @return {Object}
     *         The new draft, ready for merging into state.
     */
    generateDraft: function(base) {
      this.__draftBase = base;
      return pick(base, getDraftPropKeys(this));
    },

    /**
     * Get the current (dirty or not) draft.
     *
     * @param {Object} [extraProps={}]
     *        Convenient parameter for adding additional props to the output.
     *        Saves you from manually extending the output.
     *
     * @param {Object} options
     *        Output options.
     *
     * @param {Boolean} options.underscore
     *        Rename keys to snake_case, useful for pushing back to store.
     *
     * @return {Object}
     *         The draft props.
     */
    getDraft: function(extraProps, options) {
      var props = extend(pick(this.state, getDraftPropKeys(this)), extraProps);

      options = options || {};

      if (options.underscore) {
        props = convertCase.underscore(props);
      }

      return props;
    },

    /**
     * Reset state to what it was before any draft changes were applied.
     */
    discardDraft: function() {
      var newState = getDraftDefaults(this);

      this.__draftBase = undefined;
      this.setState(newState);
    },

    isDraftDirty: function(draft, base) {
      var propKeys = getDraftPropKeys(this);
      var propDefaults = getDraftDefaults(this);
      var i, prop;

      base = base || this.__draftBase;

      // Is there a draft at all?
      if (base === undefined) {
        return false;
      }

      draft = draft || this.getDraft();

      for (i = 0; i < propKeys.length; ++i) {
        prop = propKeys[i];

        if (draft[prop] === propDefaults[prop]) {
          continue;
        }
        else if (!isEqual(draft[prop], base[prop])) {
          return true;
        }
      }

      return false;
    },

    /**
     * Control a SaveButton based on an action result. If the promise fulfills,
     * the button will be marked as successful, otherwise, it will be marked
     * as failed.
     *
     * @param  {String} ref
     *         The "ref" property of the button you want to control.
     *
     * @param  {RSVP.Promise} [promise=this.lastAction]
     *         The action promise that should control the button. This is what
     *         you receive by calling #sendAction.
     *
     *         You can leave this empty if you're using the ActorMixin.
     */
    controlButton: function(ref, promise) {
      var button = this.refs[ref];

      if (!promise) {
        promise = this.lastAction;

        if (!promise) {
          throw new Error("You must provide a promise to #controlButton.");
        }
      }

      // Some buttons are conditionally rendered and may be removed after an
      // action is complete.
      if (!button) {
        return;
      }

      promise.then(function() {
        button.markDone(true);
      }, function() {
        button.markDone(false);
      });
    },
  };

  return DraftStateMixin;
});