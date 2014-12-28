/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var OauthFailure = React.createClass({
    getDefaultProps: function() {
      return {
        provider: '',
        message: ''
      };
    },

    render: function() {
      return(
        <div>
          <h1>That didn't really work...</h1>

          <p>
            We were unable to log you in using your {this.props.provider} account.
          </p>

          <p>Error message: {this.props.message}</p>
        </div>
      );
    }
  });

  return OauthFailure;
});