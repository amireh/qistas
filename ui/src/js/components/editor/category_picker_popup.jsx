/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!transaction_editor');
  var Common = require('./common');
  var Popup = require('jsx!components/popup');
  var CategoryPicker = require('jsx!components/category_picker');
  var Label = require('jsx!components/sidebar_label');

  var CategoryPickerPopup = React.createClass({
    propTypes: {
      linkState: React.PropTypes.func.isRequired,
      categories: React.PropTypes.array.isRequired,
      categoryIds: React.PropTypes.array
    },

    getDefaultProps: function() {
      return {
        categories: [],
        categoryIds: [],
      };
    },

    render: function() {
      return (
        <Popup
          key="category-picker"
          content={CategoryPicker}
          popupOptions={Common.popupOptions}
          items={this.props.categories}
          valueLink={this.props.linkState('categoryIds')}>
          <Label key="categories" icon="icon-tags" label={t('labels.categories', 'Categories')}>
            {this.props.categoryIds.length}
          </Label>
        </Popup>
      );
    }
  });

  return CategoryPickerPopup;
});