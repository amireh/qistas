/** @jsx React.DOM */
define([
  'ext/react',
  'ext/jquery',
  'ext/underscore',
  'util/keymapper',
  'i18n!popups',
  'stores/popups',
], function(React, $, _, Keymapper, t, PopupStore) {
  var omit = _.omit;
  var merge = _.merge;
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
  var OverlayPopup = React.createClass({
    mixins: [ React.addons.AutoFocusChildMixin, React.addons.ActorMixin ],

    statics: {
      generateId: function() {
        return PopupStore.generateUniqueId();
      }
    },

    keys: [{
      key: 'escape',
      action: 'close',
      context: 'Any open Popup',
      description: function() {
        return t('keybindings.close', 'Close');
      },
      options: {
        propagate: false
      }
    }],

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
        children: <button>Show Popup</button>,
        anchorSelector: '.popup-anchor',
        withKeybindings: true,
      };
    },

    getContentProps: function(props) {
      return omit(props, [
        'content',
        'popupOptions',
        'anchorSelector',
        'children',
        'withKeybindings',
        'ref',
        'autoFocus',
        'repositionOnScroll',
        'reactivePositioning'
      ]);
    },

    componentDidMount: function() {
      var $this = $(this.getDOMNode());
      var $anchor = this.getAnchor();
      var $childContainer = $('<div />', {
        class: 'overlay-popup'
      });

      this.id = this.constructor.generateId();

      if (!this.props.content) {
        throw new Error("You must provide a 'content' component for a popup!");
      }

      if (this.props.withKeybindings) {
        Keymapper(this, 'Popup', null);
      }

      $this.on('click.overlay_popup', this.open);

      this.setState({
        container: $childContainer[0],
        content: React.renderComponent(
          this.props.content(this.getContentProps(this.props)),
          $childContainer[0]
        )
      });
    },

    /**
     * @private
     *
     * Update the content with the new properties.
     */
    componentDidUpdate: function() {
      if (this.state.content) {
        this.state.content.setProps(this.getContentProps(this.props));

        if (!this.isOpen()) {
          this.__detach();
        }
      }
    },

    componentWillUnmount: function() {
      $(this.getDOMNode()).off('click.overlay_popup');
      React.unmountComponentAtNode(this.state.container);
    },

    reposition: function() {
    },

    render: function() {
      return this.props.children;
    },

    getAnchor: function() {
      var $this = $(this.getDOMNode());
      var $anchor = $this.find(this.props.anchorSelector);

      if (!$anchor.length) {
        $anchor = $this;
      }

      return $anchor;
    },

    open: function() {
      if (!this.isOpen()) {
        this.sendAction('popups:open', this.id).then(this.__attach);
        // this.setState({ visible: true });
      }
    },

    // Close the tooltip and restore focus to the anchor:
    close: function() {
      if (this.isOpen()) {
        this.sendAction('popups:close').then(this.__detach);
        // this.setState({ visible: false });
        // this.getAnchor().focus();
      }
    },

    __attach: function() {
      $(this.state.container).appendTo('#overlay_popups');
    },

    __detach: function() {
      $(this.state.container).detach();
    },

    isOpen: function() {
      return PopupStore.getActiveId() === this.id;
    },

    __onShow: function(event, api) {
      if (this.props.withKeybindings) {
        this.bindKeys();
      }

      if (this.props.autoFocus) {
        this.autoFocusChild(this.state.content.getDOMNode());
      }

      if (this.props.onShow) {
        this.props.onShow(this.state.container, api);
      }
    },

    __onHide: function(event, api) {
      if (this.props.withKeybindings) {
        this.unbindKeys();
      }

      if (this.props.onHide) {
        this.props.onHide();
      }
    }
  });

  return OverlayPopup;
});