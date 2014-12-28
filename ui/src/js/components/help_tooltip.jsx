/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!common');
  var $ = require('ext/jquery');

  var HelpTooltip = React.createClass({
    componentDidMount: function() {
      $(this.getDOMNode()).qtip({
        prerender: true,
        overwrite: true,

        position: {
          my: 'bottom center',
          at: 'top center'
        },

        show: {
          delay: false,
          effect: false
        },

        hide: {
          delay: false,
          effect: false
        }
      });
    },

    componentWillUnmount: function() {
      $(this.getDOMNode()).qtip('destroy', true);
    },

    render: function() {
      return(
        <span
          className="help-tooltip"
          title={this.props.title || this.props.children}
          children={t('whatisthis', 'What is this?')} />
      );
    }
  });

  return HelpTooltip;
});