/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Format = require('util/format');
  var t = require('i18n!components/balance');
  var $ = require('ext/jquery');

  var classSet = React.addons.classSet;
  var Balance = React.createClass({
    getDefaultProps: function() {
      return {
        /**
         * @property {Number} amount (required)
         */
        amount: 0,

        upcomingAmount: null,

        /**
         * @property {"-"|"+"} sign
         *
         * If the amount you're passing in is absolute but you know the sign,
         * pass it in as a string.
         */
        sign: undefined,

        unsigned: false,

        /**
         * @property {String} currency
         *
         * Optional, if you don't pass it in, the formatted number will not
         * contain the currency
         *
         * If you do, the format will be "[NUM] [CUR]"
         */
        currency: undefined
      };
    },

    componentDidMount: function() {
      var $this = $(this.getDOMNode());

      if (!!$this.attr('title')) {
        $this.qtip({
          prerender: false,
          position: {
            my: 'right center',
            at: 'left center',
          }
        });
      }
    },

    componentWillUnmount: function() {
      var $this = $(this.getDOMNode());

      if (!!$this.attr('title')) {
        $this.qtip('destroy', true);
      }
    },

    render: function() {
      var amount = this.props.amount;
      var unsigned = this.props.unsigned;
      var isNegative = amount < 0 || this.props.sign === '-';
      var upcomingAmount = this.props.upcomingAmount;
      var hasUpcomingAmount = upcomingAmount !== null && upcomingAmount !== amount;
      var currency = this.props.currency;
      var title;
      var className = classSet({
        'Pb-Balance': true,
        'balance': true,
        'negative': !unsigned && isNegative,
        'positive': !unsigned && !isNegative
      });

      // Make sure the amount is actually below 0 to get the minus sign to
      // render:
      if (isNegative && amount > 0) {
        amount *= -1;
      }

      if (hasUpcomingAmount) {
        title = t('tooltips.upcoming_balance_difference',
          'Balance including upcoming transactions will be: __balance__', {
          balance: Format.money(upcomingAmount, currency)
        })
      }

      return(
        this.transferPropsTo(
          <span className={className} title={title}>
            {hasUpcomingAmount &&
              <span className="Pb-Balance__UpcomingNotice icon-warning" />
            }

            {Format.money(amount, currency)}
          </span>
        )
      );
    }
  });

  return Balance;
});