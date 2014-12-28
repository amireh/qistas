/** @jsx React.DOM */
define([
  'ext/react',
  'ext/jquery',
  'ext/underscore',
  'util/keymapper',
  'i18n!popups',
  'modules/responsifier',
  'jsx!components/overlay_popup',
  'jsx!components/popup/qtip',
], function(React, $, _, Keymapper, t, Responsifier, OverlayPopup, QtipPopup) {
  var omit = _.omit;
  var merge = _.merge;
  var clone = _.clone;
  var throttle = _.throttle;
  var guid = 0;

  /**
   * @class Components.Popup
   *
   * Wrap a React view inside a qTip popup, perfect for use in Editors.
   *
   * Example usage:
   *
   *     // Direct instantiation:
   *
   *     React.renderComponent(Popup({
   *       content: (<div>I'm a popup content!</div>)
   *     }), div);
   *
   *     // Inside a view's render method:
   *     <Popup content={MyPopupContent} />
   *
   *     // Pass a property to the content:
   *     <Popup content={MyPopupContent} name="Ahmad" />
   *
   *     // Customize qTip options:
   *     var options = {
   *       position: {
   *         // ...
   *       }
   *     };
   *     <Popup popupOptions={options} ... />
   *
   * === Focus management
   *
   * The popup is a keyboard-friendly component.
   *
   * You can define a jQuery selector and pass it as the "autoFocus" prop where
   * the Popup will locate an element that matches that selector *inside* its
   * content when it is shown and focuses it. The focus will be restored to the
   * popup's anchor once it is closed.
   */
  var Popup = React.createClass({
    mixins: [ React.addons.AutoFocusChildMixin ],

    propTypes: {
      /**
       * @cfg {React.Class} content (required)
       *
       * The Popup's content you want to render.
       */
      content: React.PropTypes.func.isRequired,

      /**
       * @cfg {React.Component} [children=<button>Show Popup</button>]
       *
       * Element to use as the popup's "toggle" button, which when clicked will
       * show the qTip.
       */
      children: React.PropTypes.component,

      /**
       * @cfg {Object} [popupOptions={}]
       *
       * qTip options.
       */
      popupOptions: React.PropTypes.object,

      /**
       * @cfg {String} [anchorSelector=".popup-anchor"]
       *
       * CSS selector to locate a child element to use as the popup's "anchor",
       * e.g, the positioning will be relative to that element instead of the
       * entirety of the popup's children.
       *
       * When unset, or the element could not be found, it defaults to using
       * the popup's children as anchor.
       */
      anchorSelector: React.PropTypes.string,

      /**
       * @cfg {Boolean} [withKeybindings=true]
       *
       * Whether the Popup should be keyboard-aware to close on Escape and
       * handle other custom keys.
       */
      withKeybindings: React.PropTypes.bool,

      reactivePositioning: React.PropTypes.bool,

      onShow: React.PropTypes.func,
      onHide: React.PropTypes.func,
    },

    getInitialState: function() {
      return {
        /**
         * @property {HTMLElement} container
         *
         * An auto-generated element that will contain the popup's content. The
         * container is classed with "popup-content" to achieve the necessary
         * Popup styling.
         *
         * This is the DOM node at which the content component will be mounted
         * at.
         */
        container: null,

        /**
         * @property {React.Component} content
         *
         * The rendered popup content component.
         */
        content: null
      };
    },

    getDefaultProps: function() {
      return {
      };
    },

    render: function() {
      var props = omit(this.props, [ 'children' ]);

      props.ref = 'impl';
      props.onClose = this.props.onClose || this.close;

      if (Responsifier.isMobile()) {
        return OverlayPopup(props, this.props.children);
      }
      else {
        return QtipPopup(props, this.props.children);
      }
    },

    getAnchor: function() {
      return this.proxy('getAnchor');
    },

    reposition: function() {
      return this.proxy('reposition');
    },

    isOpen: function() {
      return this.proxy('isOpen');
    },

    // Close the tooltip and restore focus to the anchor:
    close: function() {
      return this.proxy('close');
    },

    proxy: function(name) {
      return this.refs.impl[name]();
    }
  });

  return Popup;
});