/** @jsx React.DOM */
define([ 'react', 'underscore', 'ext/jquery' ], function(React, _, $) {
  var classSet = React.addons.classSet;
  var DropdownMenu = React.createClass({
    getDefaultProps: function() {
      return {
        tagName: 'div'
      };
    },

    render: function() {
      var Tag = React.DOM[this.props.tagName];

      return this.transferPropsTo(
        <Tag className="dropdown-menu" role="menu">{this.props.children}</Tag>
      );
    }
  });

  var DropdownToggle = React.createClass({
    getDefaultProps: function() {
      return {
        withArrow: false
      };
    },

    render: function() {
      var className = classSet({
        'dropdown-toggle': true,
        'btn-dropdown': true,
        'with-arrow': this.props.withArrow
      });

      return this.transferPropsTo(
        <button className={className}>
          {this.props.children}
        </button>
      );
    }
  });

  var DropdownItem = React.createClass({
    getDefaultProps: function() {
      return {
      };
    },

    render: function() {
      var className = classSet({
        'dropdown-item': true
      });

      return (
        <li>
          {this.transferPropsTo(
            <a className={className}>{this.props.children}</a>
          )}
        </li>
      );
    }
  });

  /**
   * @class Components.Dropdown
   *
   * Wrap a list of items inside a $.dropdown.
   */
  var Dropdown = React.createClass({
    propTypes: {
      children: React.PropTypes.renderable.isRequired
    },

    getDefaultProps: function() {
      return {
        /**
         * @cfg {Boolean} [toggle=true]
         * Toggle between showing and hiding the dropdown when the trigger element
         * is clicked, based on the dropdown's current state of visibility.
         */
        toggle: true,

        /**
         * @cfg {Boolean} [activate=true]
         * When the dropdown is visible, add an .active class to the trigger element
         * and any button inside the dropdown menu.
         */
        activate: true,

        /**
         * @cfg {Boolean/String} [sticky='auto']
         * Sticky dropdowns will not hide when a click lands inside of them.
         */
        sticky: 'auto',

        /**
         * @cfg {Boolean/String} [dropup='auto']
         * Turn the dropdown into a drop-up if there's not enough room to show it
         * below the trigger element. The resolution is done at show-time.
         *
         * On drop-up:
         *
         *  * the menu's parent element will be classed with .dropup
         *  * the dropdown menu element will be classed with .bottom-up
         */
        dropup: 'auto',

        /**
         * @cfg {String} [closeOn='']
         *
         * Optional selector for elements that should close the dropdown. This
         * can be used to hide the dropdown by clicking on elements *inside*
         * the menu.
         */
        closeOn: '',

        /**
         * @cfg {Boolean} [closeOnBackground=true]
         * Close the dropdown when a click lands outside of it.
         */
        closeOnBackground: true,

        duration: 150,

        textual: false,

        /**
         * @cfg {Boolean} invisibilityFix
         *
         * If your dropdown shows with a caret, and it's bugging you that
         * hovering over the whitespace around the caret hides the dropdown
         * unless it's active, then add this class to make it so that the menu
         * stays open even when the cursor is over the blank canvas around the
         * caret.
         *
         * This property will add the "invisibility-fix" class to ".dropdown".
         */
        invisibilityFix: false,

        withCaret: true,

        onOpen: function() {},
        onClose: function() {}
      };
    },

    componentDidMount: function() {
      var $dropdown;
      var $this = $(this.getDOMNode());
      var $toggle = $this.find('.dropdown-toggle');

      if (!$toggle.length) {
        $toggle = $(this.refs.list.getDOMNode());
      }

      $dropdown = $toggle.dropdown(this.props)
        .on('show.dropdown', this.props.onOpen)
        .on('hide.dropdown', this.props.onClose);
    },

    render: function() {
      return this.transferPropsTo(React.DOM.div({
        ref: 'list',
        className: classSet({
          'dropdown': true,
          'textual-dropdown': this.props.textual,
          'invisibility-fix': this.props.invisibilityFix,
          'no-caret': !this.props.withCaret
        })
      }, this.props.children));
    }
  });

  Dropdown.Menu = DropdownMenu;
  Dropdown.Toggle = DropdownToggle;
  Dropdown.Item = DropdownItem;

  return Dropdown;
});