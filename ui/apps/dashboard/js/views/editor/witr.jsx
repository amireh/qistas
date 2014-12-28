/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!editor/witr');
  var Checkbox = require('jsx!components/checkbox');

  var Witr = React.createClass({
    render: function() {
      return(
        <div>
          <Checkbox
            checkedLink={this.props.linkState('inLastThird')}
            label={t('checkboxes.in_last_third', "During the last third of the night")} />
        </div>
      );
    }
  });

  return Witr;
});