/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!editor');
  var Checkbox = require('jsx!components/checkbox');

  var CommonPrayerBonuses = React.createClass({
    render: function() {
      return(
        <div>
          <Checkbox
            checkedLink={this.props.linkState('onTime')}
            label={t('checkboxes.on_time', "On time")} />

          <Checkbox
            checkedLink={this.props.linkState('inCongregation')}
            label={t('checkboxes.in_congregation', "In congregation")} />

          {this.props.linkState('inCongregation').value &&
            <div className="ig-indent">
              <Checkbox
                checkedLink={this.props.linkState('inMosque')}
                label={t('checkboxes.in_mosque', "In Masjid")} />
            </div>
          }

          <Checkbox
            checkedLink={this.props.linkState('withDhikr')}
            label={t('checkboxes.dhikr', "With post-prayer Dhikr")} />
        </div>
      );
    }
  });

  return CommonPrayerBonuses;
});