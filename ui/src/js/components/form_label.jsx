/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var classSet = React.addons.classSet;

  var FormLabel = React.createClass({
    getDefaultProps: function() {
      return {
        caption: null,
        captionSize: "small"
      };
    },

    render: function() {
      var props = {};
      var className = {};

      props.children = this.props.children;

      className['form-label'] = true;

      if (this.props.caption) {
        props.children = [ this.renderCaption() , this.props.children ];
      }

      props.className = classSet(className);

      return(
        React.DOM.label(props)
      );
    },

    renderCaption: function() {
      var className = {};

      className['form-label__fixed-width-caption'] = true;
      className['size-' + this.props.captionSize] = true;

      return (
        <span key="caption" className={classSet(className)}>
          {this.props.caption}
        </span>
      );
    }
  });

  return FormLabel;
});