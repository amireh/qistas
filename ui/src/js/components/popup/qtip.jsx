/** @jsx React.DOM */
define([
  'ext/react',
  'ext/jquery',
  'ext/underscore',
  'util/keymapper',
  'i18n!popups',
], function(React, $, _, Keymapper, t) {
  var omit = _.omit;
  var merge = _.merge;
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
        popupOptions: {},
        anchorSelector: '.popup-anchor',
        withKeybindings: true,
        reactivePositioning: false,

        repositionOnScroll: $()
      };
    },

    getContentProps: function(props) {
      return omit(props, [
        'content', 'popupOptions', 'anchorSelector', 'children',
        'withKeybindings', 'ref', 'autoFocus',
        'repositionOnScroll',
        'reactivePositioning'
      ]);
    },

    /**
     * @private
     *
     * Update the content with the new properties.
     */
    componentDidUpdate: function() {
      var shouldReposition;
      var reposition = this.reposition;

      if (this.state.content) {
        shouldReposition = !!this.props.reactivePositioning;

        this.state.content.setProps(this.getContentProps(this.props), function() {
          if (shouldReposition) {
            reposition();
          }
        });
      }
    },

    reposition: function() {
      var qTip = this.qTip;

      if (qTip) {
        qTip.reposition();
      }
    },

    render: function() {
      return this.props.children;
    },

    componentDidMount: function() {
      var $this = $(this.getDOMNode());
      var $anchor = this.getAnchor();
      var $childContainer = $('<div class="popup-content" />');
      var options;

      if (!this.props.content) {
        throw new Error("You must provide a 'content' component for a popup!");
      }

      options = this.qtipOptions($this, $childContainer);
      this.qTip = $anchor.qtip(options).qtip('api');

      if (this.props.withKeybindings) {
        Keymapper(this, 'Popup', null);
      }

      this.throttledReposition = throttle(this.reposition, 500, {
        leading: false, trailing: true
      });

      this.setState({
        container: $childContainer[0],
        content: React.renderComponent(
          this.props.content(this.getContentProps(this.props)),
          $childContainer[0]
        )
      });
    },

    getAnchor: function() {
      var $this = $(this.getDOMNode());
      var $anchor = $this.find(this.props.anchorSelector);

      if (!$anchor.length) {
        $anchor = $this;
      }

      return $anchor;
    },

    __eventNs: function(evt) {
      return evt + '.' + ([ 'popup', guid++ ].join('_'));
    },

    componentWillUnmount: function() {
      React.unmountComponentAtNode(this.state.container);

      if (this.qTip) {
        this.qTip.destroy(true);
      }
    },

    /**
     * Common qTip popup options.
     *
     * @param {jQuery[]} $buttons
     * Buttons that will show or hide the popup.
     *
     * @param {jQuery} $content
     * The content (or content element) of the popup.
     */
    qtipOptions: function($buttons, $content) {
      return merge({}, {
        overwrite: false,
        prerender: false,
        show: {
          event: 'click',
          delay: 0,
          target: $buttons,
          effect: false,
          solo: false
        },

        hide: {
          event: 'click',
          effect: false,
          fixed: true,
          target: $buttons
        },

        style: {
          classes: 'popup',
          def: false,
          tip: {
            // corner: 'right center',
            width: 12,
            height: 6
          }
        },

        position: {
          effect: false,
          my: 'right center',
          at: 'left center',
          adjust: {
            x: 0,
            y: 0
          }
        },

        content: {
          text: $content
        },

        events: {
          show: this.__onShow,
          hide: this.__onHide
        }
      }, this.props.popupOptions);
    },

    // Close the tooltip and restore focus to the anchor:
    close: function() {
      if (this.qTip.shown) {
        this.qTip.hide();
        this.getAnchor().focus();
      }
    },

    isOpen: function() {
      return !!this.qTip.shown;
    },

    getApi: function() {
      return this.qTip;
    },

    __onShow: function(event, api) {
      var $scrollers = $(this.props.repositionOnScroll);

      api.shown = true;

      if (this.props.withKeybindings) {
        this.bindKeys();
      }

      if (this.props.autoFocus) {
        this.autoFocusChild(this.state.content.getDOMNode());
      }

      if ($scrollers.length) {
        $scrollers.on(this.__eventNs('scroll'), this.throttledReposition);
      }

      if (this.props.onShow) {
        this.props.onShow(this.state.container, api);
      }
    },

    __onHide: function(event, api) {
      var $scrollers = $(this.props.repositionOnScroll);

      api.shown = false;

      if ($scrollers.length) {
        $scrollers.off(this.__eventNs('scroll'));
      }

      if (this.props.withKeybindings) {
        this.unbindKeys();
      }

      if (this.props.onHide) {
        this.props.onHide();
      }
    }
  });

  return Popup;
});