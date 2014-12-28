/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!editor/fajr');
  var Checkbox = require('jsx!components/checkbox');

  var Fajr = React.createClass({
    render: function() {
      return(
        <div>
          <Checkbox
            checkedLink={this.props.linkState('withSunnah')}
            label={t('checkboxes.with_sunnah', "With the (two-rak'ah) Sunnah")} />

          {this.props.linkState('withSunnah').value && this.renderSunnahOptions()}
        </div>
      );
    },

    renderSunnahOptions: function() {
      return (
        <div className="ig-indent">
          <Checkbox
            checkedLink={this.props.linkState('withSunnahOnTime')}
            label={t('checkboxes.with_sunnah_on_time', "On time; prior to the Fajr prayer")} />
        </div>
      )
    }
  });

  return Fajr;
});