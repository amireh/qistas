/** @jsx React.DOM */
define([ 'react', 'ext/react/link_utils', 'underscore' ], function(React, LinkUtils, _) {
  var clone = _.clone;
  var contains = _.contains;

  var updateMultipleSelection = function(props, e) {
    var selection = clone(LinkUtils.getValue(props) || []);
    var id = e.target.value;
    var isChecked = e.target.checked;
    var index = selection.indexOf(id);
    var wasChecked = index > -1;

    if (isChecked && !wasChecked) {
      selection.push(id);
    }
    else if (!isChecked && wasChecked) {
      selection.splice(index, 1);
    }

    console.debug('Selection has changed for item "' + id + '" from:',
      wasChecked, 'to:', isChecked,
      '(in:', selection, ')');

    return selection;
  };

  var updateSingleSelection = function(props, e) {
    return e.target.value;
  };

  return {
    propTypes: {
      value: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.string),
        React.PropTypes.string
      ])
    },

    getDefaultProps: function() {
      return {
      };
    },

    onChange: function(e) {
      var selection;

      if (this.props.multiple) {
        selection = updateMultipleSelection(this.props, e);
      }
      else {
        selection = updateSingleSelection(this.props, e);
      }

      if (this.onSelectionChange) {
        this.onSelectionChange(selection);
      }
      else {
        React.LinkUtils.onChange(this.props, selection);
      }
    },

    isChecked: function(id) {
      if (this.props.multiple) {
        return contains(LinkUtils.getValue(this.props), id);
      } else {
        return LinkUtils.getValue(this.props) === id;
      }
    }
  };
});