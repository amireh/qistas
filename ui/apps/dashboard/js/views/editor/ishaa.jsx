/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!editor/ishaa');
  var Checkbox = require('jsx!components/checkbox');

  var Ishaa = React.createClass({
    render: function() {
      return(
        <div>
          <Checkbox
            checkedLink={this.props.linkState('withSunnah')}
            label={t('checkboxes.with_sunnah', "With the (two-rak'ah) subsequent Sunnah")} />
        </div>
      );
    }
  });

  return Ishaa;
});