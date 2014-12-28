/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var SidebarLabel = React.createClass({
    getDefaultProps: function() {
      return {
        label: undefined,
        icon: undefined,
        children: undefined,
        toggle: true,
        /**
         * @type {String}
         *
         * Pass a name for a form field here to use as an alternate field to
         * show form errors.
         *
         * This is useful if the field may be inside a popup or just not visible
         * all the time, then this label will act as a replacement for the field
         * for displaying errors.
         */
        formErrorField: undefined
      };
    },

    render: function() {
      return this.props.toggle ? this.renderToggleButton() : this.renderLabel();
    },

    renderToggleButton: function() {
      var klasses;

      klasses = {};
      // klasses[this.props.icon] = true;
      klasses['popup-anchor'] = true;

      return (
        <div key={this.props.label} className="sidebar-label sidebar-popup-toggle">
          {this.renderFormErrorField()}
          <button type="button" className={React.addons.classSet(klasses)} children={this.props.label} />
          <div className="item-value" children={this.props.children} />
        </div>
      );
    },

    renderLabel: function() {
      var content;

      if (this.props.label) {
        content = [
          <span key="label" children={this.props.label} />,
          <div key="value" className="item-value">{this.props.children}</div>
        ];
      } else {
        content = this.props.children;
      }

      return (
        <label className="sidebar-label">
          {this.renderFormErrorField()}
          {content}
        </label>
      );
    },

    renderFormErrorField: function() {
      return this.props.formErrorField ?
        <i data-form-error={this.props.formErrorField} /> :
        false;
    }
  });

  return SidebarLabel;
});