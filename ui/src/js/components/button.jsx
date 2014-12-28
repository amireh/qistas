/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var classSet = React.addons.classSet;

  var Button = React.createClass({
    getDefaultProps: function() {
      return {
        type: 'default',
        bordered: false,
        accessibilityOnly: false,
        icon: null,
        size: 'normal'
      };
    },

    render: function() {
      var className = {};

      if (this.props.accessibilityOnly) {
        className['btn-a11y'] = true;
      }
      else {
        className['btn'] = true;
        className['btn-' + this.props.type] = true;

        if (this.props.bordered) {
          className['btn-bordered'] = true;
        }
      }

      if (this.props.size === 'small') {
        className['btn-small'] = true;
      }

      return this.transferPropsTo(React.DOM.button({
        className: classSet(className),
        type: 'button'
      }, this.props.children));
    }
  });

  return Button;
});