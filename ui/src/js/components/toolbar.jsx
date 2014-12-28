/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var Toolbar = React.createClass({
    mixins: [ React.addons.TooltipsMixin ],

    render: function() {
      return this.transferPropsTo(
        <div>{this.props.children}</div>
      );
    }
  });

  return Toolbar;
});