/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  // var Alert = require('jsx!components/alert');
  var Error = React.createClass({
    getInitialState: function() {
      return {
        apiError: null
      };
    },

    render: function() {
      var error = this.state.apiError;

      if (!error) {
        return null;
      }

      return(
        <div className="alert alert-danger">
          {this.formatError(error)}

          <a onClick={this.dismiss}>Dismiss</a>
        </div>
      );
    },

    formatError: function(error) {
      return JSON.stringify(error, null, 2);
    },

    dismiss: function(e) {
      e.preventDefault();
      this.setState({ apiError: null });
    }
  });

  return Error;
});