define([ 'react', 'jquery' ], function(React, $) {
  /**
   * @class Mixins.Components.AutoFocusChild
   *
   * A mixin that automatically focuses a specific element after the component
   * has been mounted (works against layered elements, like qTip popups and
   * dialogs.)
   */
  var AutoFocusChildMixin = {
    propTypes: {
      autoFocus: React.PropTypes.string
    },

    getDefaultProps: function() {
      return {
        /**
         * @cfg {String} [autoFocus=null]
         *
         * Selector to a DOM node to auto-focus when the dialog is brought to
         * front.
         *
         * Defaults to the component's element if not present.
         */
        autoFocus: null,

        autoFocusOnMount: false
      };
    },

    componentDidMount: function() {
      if (this.props.autoFocusOnMount) {
        setTimeout(this.autoFocusChild, 50);
      }
    },

    autoFocusChild: function(container) {
      if (!this.isMounted()) {
        return;
      }

      var focusNode = container || this.getDOMNode();
      var focusNodeSelector = this.props.autoFocus;

      if (focusNodeSelector) {
        focusNode = $(focusNode).find(focusNodeSelector)[0];
      }

      if (focusNode) {
        setTimeout(function() {
          focusNode.focus();
        }, 1);
      }
    }
  };

  return AutoFocusChildMixin;
});