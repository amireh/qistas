/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Button = require('jsx!components/button');
  var $ = require('jquery');

  var ButtonPanel = React.createClass({
    render: function() {
      var STATES = [ null, 'hover', 'active', 'disabled' ];

      return (
        <fieldset>
          <legend>
            {this.props.type.capitalize()}
          </legend>

          {STATES.map(this.renderButton)}

          <Button key="bordered" ref="button_bordered" bordered type={this.props.type}>
            {this.props.type.capitalize()} (bordered)
          </Button>
        </fieldset>
      )
    },

    componentDidMount: function() {
      $(this.refs["button_active"].getDOMNode()).addClass('btn-active', true);
      $(this.refs["button_active"].getDOMNode()).addClass('btn-'+this.props.type+'-active');

      $(this.refs["button_disabled"].getDOMNode()).prop('disabled', true);
      $(this.refs["button_hover"].getDOMNode()).addClass('btn-hover');
      $(this.refs["button_hover"].getDOMNode()).addClass('btn-'+this.props.type+'-hover');
    },

    renderButton: function(state) {
      return (
        <Button
          style={{'margin-right': '5px', width: '140px' }}
          key={"button_"+state}
          ref={"button_"+state}
          type={this.props.type}>
          {this.props.children || (state ? state.capitalize() : this.props.type.capitalize())}
        </Button>
      );
    }
  });

  var Buttons = React.createClass({
    render: function() {
      return(
        <div>
          <ButtonPanel type="default" />
          <ButtonPanel type="primary" />
          <ButtonPanel type="success" />
          <ButtonPanel type="warning" />
          <ButtonPanel type="danger" />
          <ButtonPanel type="info" />
          <ButtonPanel type="link" />
          <ButtonPanel type="a11y" />
        </div>
      );
    }
  });

  return Buttons;
});