/** @jsx React.DOM */
define(function(require) {
  var React = require('react');

  /**
   * @class Components.Checkbox
   *
   * A nice-looking custom checkbox. This component takes care of wrapping
   * the checkbox with a label, so just pass in a "label" prop and other props
   * to the <input /> field itself you may need.
   */
  var Checkbox = React.createClass({
    propTypes: {
      label: React.PropTypes.string
    },

    getDefaultProps: function() {
      return {
        spanner: false
      };
    },

    render: function() {
      var className = React.addons.classSet({
        'skinned-checkbox': true,
        'input-spanner': !!this.props.spanner
      });

      return(
        <label className={className}>
          {this.transferPropsTo(<input tabIndex="0" type="checkbox" />)}
          <span>{this.props.label || this.props.children}</span>
        </label>
      );
    }
  });

  return Checkbox;
});