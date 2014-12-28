/** @jsx React.DOM */
define([
  'react',
  'underscore',
  'mixins/single_selection',
  'json!config/available_emblems',
  'jsx!components/emblem'
],
function(React, _, SingleSelection, AvailableIcons, Emblem) {
  var GUID = 0;

  /**
   * @class Components.IconPicker
   *
   * [brief component description]
   */
  var IconPicker = React.createClass({
    mixins: [ SingleSelection ],

    getDefaultProps: function() {
      return {
        icon: null
      };
    },

    render: function() {
      ++GUID;

      return (
        <div className="icon-picker">
          {AvailableIcons.map(this.renderIcon)}
        </div>
      );
    },

    renderIcon: function(icon) {
      return (
        <label className="skinned-radio" key={icon}>
          <input
            type="radio"
            name={"icon_" + GUID}
            value={icon}
            onChange={this.onChange}
            checked={this.isChecked(icon)}
            />
          <Emblem skipStyling emblem={icon} />
        </label>
      );
    },

    onSelectionChange: function(selection) {
      React.LinkUtils.onChange(this.props, selection);
    }
  });

  return IconPicker;
});