/** @jsx React.DOM */
define([
  'ext/react', 'underscore', 'ext/jquery', 'modules/combobox'
], function(React, _, $, ComboBox) {
  var LinkUtils = React.LinkUtils;
  var extend = _.extend;
  var classSet = React.addons.classSet;

  /**
   * @class Components.Chosen
   *
   * Wrap a `<select />` with a Chosen.
   */
  var Chosen = React.createClass({
    propTypes: {
      children: React.PropTypes.arrayOf(React.PropTypes.component).isRequired,

      /**
       * @config {Object} [chosenOptions={}]
       *
       * Chosen options.
       */
      chosenOptions: React.PropTypes.object,

      /**
       * @config {Boolean} [synchronize=true]
       *
       * Turn this on if you don't want Chosen to update itself as soon as the
       * user changes the selection (e.g, you want the flow to update it
       * instead.)
       */
      synchronize: React.PropTypes.bool,

      withArrow: React.PropTypes.bool,
      withSearch: React.PropTypes.bool,

      width: React.PropTypes.string,
      placeholder: React.PropTypes.string,
    },

    getDefaultProps: function() {
      return {
        synchronize: true,
        withSearch: false,
        multiple: false,

        /**
         * @cfg {Boolean} [deselectable=false]
         *
         * Turning this on will show a "reset" control button any time an option
         * is selected. Clicking that button will deselect the option, returning
         * the value to null.
         */
        deselectable: false,

        width: '100px',
        chosenOptions: {}
      };
    },

    componentDidMount: function() {
      var $select, options;

      $select = $(this.refs.select.getDOMNode());
      $select.on('change', LinkUtils.getChangeHandler(this.props));

      if (this.props.synchronize) {
        $select.on('change', this._synchronizeChosen);
      }

      options = extend({
        width: this.props.width,
        minWidth: this.props.width,
        disable_search: !this.props.withSearch,
        multiple: this.props.multiple,
        placeholder_text: this.props.placeholder,
        allow_single_deselect: this.props.deselectable
      }, this.props.chosenOptions);

      ComboBox.create($select, options);
    },

    componentWillUnmount: function() {
      ComboBox.destroy($(this.refs.select.getDOMNode()));
    },

    componentDidUpdate: function() {
      ComboBox.update($(this.refs.select.getDOMNode()));
    },

    render: function() {
      var className = classSet({
        'with-arrow': this.props.withArrow
      });

      return this.transferPropsTo(React.DOM.select({
        ref: 'select',
        className: className,
        multiple: this.props.multiple
      }, this.props.children));
    },

    _synchronizeChosen: function() {
      var select;

      select = this.refs.select.getDOMNode();
      select.value = LinkUtils.getValue(this.props);

      ComboBox.update($(select));
    }
  });

  return Chosen;
});