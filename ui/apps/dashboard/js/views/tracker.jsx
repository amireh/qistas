/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Editor = require('jsx!./editor');
  var Dialog = require('jsx!components/dialog');

  var Tracker = React.createClass({
    render: function() {
      return(
        <Dialog onClose={this.props.onClose} children={Editor(this.props)} />
      );
    }
  });

  return Tracker;
});