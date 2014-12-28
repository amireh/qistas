/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var classSet = React.addons.classSet;
  var ToolbarButton = React.createClass({
    getInitialState: function() {
      return {
        active: this.props.active
      };
    },

    getDefaultProps: function() {
      return {
        tagName: 'button',
        autoActivate: true
      };
    },

    render: function() {
      var tag = React.DOM[this.props.tagName];
      var tagProps = {};
      var className = classSet({
        'toolbar-btn': true,
        'active': this.props.active === undefined ?
          this.props.autoActivate && this.state.active :
          this.props.active
      });

      tagProps.onClick = this.markActive;
      tagProps.className = className;

      if (this.props.tagName === 'button') {
        tagProps.type = 'button';
      }

      return this.transferPropsTo(tag(tagProps, [
        this.props.icon && <i key="icon" className={this.props.icon}></i>,
        this.props.children
      ]));
    },

    markActive: function(e) {
      var isActive = !this.state.active;

      this.setState({ active: isActive });

      if (this.props.onClick) {
        return this.props.onClick(e, isActive);
      }
    }
  });

  return ToolbarButton;
});