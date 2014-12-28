/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var OauthSuccess = React.createClass({
    getDefaultProps: function() {
      return {
        provider: ''
      };
    },

    render: function() {
      return(
        <div>Yeah! You've logged in using {this.props.provider}</div>
      );
    }
  });

  return OauthSuccess;
});