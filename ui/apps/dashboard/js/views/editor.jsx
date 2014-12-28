/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Pixy = require('pixy');
  var Radio = require('jsx!components/radio');
  var t = require('i18n!editor');
  var K = require('constants');
  var _ = require('lodash');
  var FajrOptions = require('jsx!./editor/fajr');
  var DhuhrOptions = require('jsx!./editor/dhuhr');
  var AsrOptions = require('jsx!./editor/asr');
  var MaghribOptions = require('jsx!./editor/maghrib');
  var IshaaOptions = require('jsx!./editor/ishaa');
  var WitrOptions = require('jsx!./editor/witr');
  var CommonPrayerBonuses = require('jsx!./editor/common_prayer_bonuses');
  var DatePicker = require('jsx!components/date_picker');
  var moment = require('moment');
  var Popup = require('jsx!components/popup');
  var Actions = require('../actions');
  var outboundAttrs = K.PRAYER_OUTBOUND_ATTRS.map(function(attr) {
    return attr.camelize(true);
  });

  var clone = _.clone;
  var extend = _.extend;
  var pick = _.pick;

  var PRIMARY_PRAYERS = [
    K.PRAYER_FAJR,
    K.PRAYER_DHUHR,
    K.PRAYER_ASR,
    K.PRAYER_MAGHRIB,
    K.PRAYER_ISHAA
  ];

  var Editor = React.createClass({
    mixins: [ React.addons.LinkedStateMixin ],

    getInitialState: function() {
      return {
      };
    },

    getDefaultProps: function() {
      return {
        prayer: null
      };
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (this.props.prayer !== prevProps.prayer) {
        this.replaceState(pick(this.props.prayer || {}, outboundAttrs));
      }

      if (this.props.onChange) {
        this.props.onChange();
      }
    },

    render: function() {
      return(
        <form id="PrayerEditor" onSubmit={this.consume}>

          <div className="PrayerEditor__PrayerOptions">
            {this.renderPrayer()}
          </div>

          <div className="PrayerEditor__Actions">
            <input type="reset" ref="resetButton" hidden />
            <button
              type="button"
              onClick={this.props.onClose}
              className="btn btn-default"
              children={<i className="icon-close" />} />

            <button
              type="submit"
              onClick={this.save}
              className="btn btn-success"
              children={<i className="icon-checkmark" />} />
          </div>
        </form>
      );
    },

    renderPrayer: function(renderer) {
      var type = this.props.type;
      var isPrimary = PRIMARY_PRAYERS.indexOf(type) > -1;
      var prayerOptions;

      switch(type) {
        case K.PRAYER_FAJR:
          prayerOptions = FajrOptions;
        break;
        case K.PRAYER_DHUHR:
          prayerOptions = DhuhrOptions;
        break;
        case K.PRAYER_ASR:
          prayerOptions = AsrOptions;
        break;
        case K.PRAYER_MAGHRIB:
          prayerOptions = MaghribOptions;
        break;
        case K.PRAYER_ISHAA:
          prayerOptions = IshaaOptions;
        break;
        case K.PRAYER_WITR:
          prayerOptions = WitrOptions;
        break;
      }

      if (!isPrimary && !prayerOptions) {
        return null;
      }

      return (
        <div>
          {isPrimary && <CommonPrayerBonuses linkState={this.linkState} />}
          {prayerOptions && <prayerOptions linkState={this.linkState} />}
        </div>
      )
    },

    consume: function(e) {
      e.preventDefault();
    },

    save: function(e) {
      var params;

      this.consume(e);

      params = clone(this.state);
      params.type = this.props.type;
      params.date = this.props.date;

      Actions.save(params);
    }
  });

  return Editor;
});