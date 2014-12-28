/** @jsx React.DOM */
define([ 'react', 'underscore', 'mixins/selectable' ],
function(React, _, Selectable) {
  var savedItems = function(item) {
    return item.id && item.id !== 'new';
  };

  /**
   * @class Components.CategoryPicker
   *
   * A picker that allows you to choose a single category or a number of them.
   * The categories are rendered in a grid-fashion with their emblems taking
   * main stage.
   */
  var CategoryPicker = React.createClass({
    mixins: [ Selectable ],
    propTypes: {
      items: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        name: React.PropTypes.string,
        icon: React.PropTypes.string
      }))
    },

    getDefaultProps: function() {
      return {
        items: [],
        multiple: true
      };
    },

    render: function() {
      return (
        <div onChange={this.onChange} className="category-picker">
          {this.props.items.filter(savedItems).map(this.renderItem)}
        </div>
      );
    },

    renderItem: function(item) {
      var tagType = this.props.multiple ? 'checkbox' : 'radio';
      var className = this.props.multiple ? 'skinned-checkbox' : 'skinned-radio';

      return (
        <label key={item.id} className={className}>
          <input
            type={tagType}
            value={item.id}
            readOnly
            checked={this.isChecked(item.id)}
            />
          <i className={'emblem-' + item.icon} />
          <span children={item.name} />
        </label>
      );
    }
  });

  return CategoryPicker;
});