/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var DateRangePicker = require('jsx!components/date_range_picker');
  var Popup = require('jsx!components/popup');
  var t = require('i18n!components/upcoming_recurrings');

  var Controls = React.createClass({
    mixins: [ React.addons.ActorMixin ],

    render: function() {
      return(
        <div className="controls">
          <Popup
            content={DateRangePicker}
            from={this.props.from}
            to={this.props.to}
            useFormat={false}
            autoSave={false}
            onSave={this.updatePeriod}
            pastQuickDates={false}
            futureQuickDates={true}
            repositionOnScroll="#content"
            ref="popup"
            popupOptions={
              {
                position: {
                  my: 'middle right',
                  at: 'middle left'
                }
              }
            }>

            <small>
              <a>
                {t('buttons.change_period', 'Change the period.')}
              </a>
            </small>
          </Popup>
        </div>
      );
    },

    updatePeriod: function(from, to, _fmt) {
      this.sendAction('dashboard:changeUpcomingRecurringPeriod', {
        from: from,
        to: to,
        reload: true
      });

      this.refs.popup.close();
    }
  });

  return Controls;
});