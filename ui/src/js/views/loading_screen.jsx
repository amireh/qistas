/** @jsx React.DOM */
define([ 'react', 'jquery', 'version' ], function(React, $, VERSION) {
  var LoadingScreen = React.createClass({
    getDefaultProps: function() {
      return {
      };
    },

    componentDidMount: function() {
      $(document.body).addClass('state-loading');
    },

    componentWillUnmount: function() {
      $(document.body).removeClass('state-loading');
    },

    render: function() {
      return(
        <div id="loading_screen" className="loading">
          <header><span id="loading_status"></span></header>
          <div className="logo text-center crazy-flip icon-pibi-framed icon-128" />
          <small className="version">Pibi <span id="version">{VERSION}</span></small>
        </div>
      );
    }
  });

  return LoadingScreen;
});