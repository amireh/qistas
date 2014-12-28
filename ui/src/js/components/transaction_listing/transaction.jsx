/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var $ = require('ext/jquery'); // $.fn.scrollintoview()
  var _ = require('ext/underscore');
  var t = require('i18n!components/transaction_listing');
  var moment = require('moment');
  var Balance = require('jsx!components/balance');
  var AttachmentIndicator = require('jsx!./transaction/attachment_indicator');
  var diff = require('util/diff');
  var noop = require('util/noop');

  var zipPairs = _.zipPairs;
  var classSet = React.addons.classSet;
  var Transaction = React.createClass({
    getDefaultProps: function() {
      return {
        /**
         * @property {Float} amount (required)
         */
        amount: 0,

        /**
         * @property {"expense"|"income"} type (required)
         */
        type: null,

        currency: 'USD',
        occurredOn: undefined,
        note: '',

        /**
         * @property {String} icon
         *
         * The primary category icon.
         */
        icon: 'default',

        /**
         * @property {String[]} categories
         *
         * Set of category names.
         */
        categories: [],

        splits: [],

        paymentMethod: {
          name: null,
          color: '000000'
        },

        attachments: [],

        onActivate: noop,
        onEdit: noop,

        showAccount: false,

        committed: true,
        accounts: []
      };
    },

    render: function() {
      var occurrence = moment(this.props.occurredOn);
      var position = moment(this.props.occurredOn, 'LL').unix();
      var categories = this.props.categories;
      var type = this.props.type;
      var sign = this.props.type === 'expense' ? '-' : '+';
      var isUpcoming = !this.props.committed;
      var isTransfer = !!this.props.transfer;
      var icon = isTransfer ? 'power' : this.props.icon;

      if (!categories.length) {
        categories = [
          isTransfer ?
            t('default_transfer_tag', 'Transfer') :
            t('default_tag', 'Untagged')
        ];
      }

      var className = classSet(zipPairs(
        [ 'tx-listing-entry', true ],
        [ type, !!type ],
        [ 'is-active', this.props.active ],
        [ 'is-upcoming', isUpcoming ],
        [ 'is-transfer', isTransfer ]
      ));

      var noteClassName = classSet(zipPairs(
        [ 'tx-note', true ],
        [ 'icon-bubble', true ],
        [ 'empty', !this.props.note ]
      ));

      var categoryClassName = classSet(zipPairs(
        [ 'tx-categories', true ],
        [ 'tx-emblem', true ],
        [ 'emblem-' + icon, true ]
      ));

      var paymentMethodColor = this.props.paymentMethod.color || '000000';

      return (
        <li className={className}
            onClick={this.props.onActivate.bind(null, this.props.id)}
            onDoubleClick={this.props.onEdit.bind(null, this.props.id)}
            data-occurrence={position}>

          <div className="tx-left-side">
            <div className={categoryClassName}>
              {categories.join(', ')}

              {this.props.showAccount && this.props.accountLabel &&
                <span className="tx-account">
                  {t('account_label', '(in __account__)', {
                    account: this.props.accountLabel
                  })}
                </span>
              }
            </div>

            {isUpcoming &&
              <p className="tx-upcoming-notice">
                {t('upcoming_transaction_notice', 'This transaction is not yet due.')}
              </p>
            }

            {isTransfer && this.renderTransferNotice()}

            <span className="tx-occured-on">
              {occurrence.calendar()}
              {' '}
            </span>

            <span className={noteClassName}>
              {this.props.note}
            </span>

            <AttachmentIndicator attachments={this.props.attachments} />
          </div>

          <div className="tx-right-side">
            <div className="tx-amount-data">
              <Balance className="tx-amount" sign={sign} amount={this.props.amount} />

              {this.props.splits.length > 0 && this.renderSplits()}

              <span className="tx-pm">
                {this.props.paymentMethod.name}
              </span>

              <span className="tx-currency">
                {this.props.currency + ' '}
              </span>
            </div>

            <div  style={{ 'background-color': '#' + paymentMethodColor }}
                  className="tx-pm-color" />
          </div>
        </li>
      );
    },

    renderSplits: function() {
      var renderSplit = function(split) {
        var title;

        // show the full memo as a tooltip for longer memos (20+ chars):
        if ((split.memo||'').length > 20) {
          title = split.memo;
        }

        return (
          <li key={"split-"+split.id}>
            <span className="split-memo" title={title}>{split.memo}</span>
            <span className="split-amount">
              <Balance amount={split.amount} unsigned />
            </span>
          </li>
        );
      };

      return (
        <ul className="tx-splits">
          {this.props.splits.map(renderSplit)}
        </ul>
      )
    },

    shouldComponentUpdate: function(nextProps/*, nextState*/) {
      return nextProps.active || !!diff.rusDiff(this.props, nextProps);
    },

    componentDidUpdate: function() {
      var $this;

      // scroll ourselves into view if we're active
      // if (this.props.active) {
      //   $this = $(this.getDOMNode());
      //   $this.scrollintoview();
      // }
    },

    renderTransferNotice: function() {
      var transfer = this.props.transfer;
      var targetAccount = this.props.accounts.filter(function(account) {
        return account.id === transfer.accountId;
      })[0];

      var spouseLink = (
        <a href={transfer.transactionUrl}>
          #{transfer.transactionId}
        </a>
      );

      var notice;

      if (transfer.type === 'inbound') {
        notice = (
          <p className="tx-transfer-notice">
            {t.htmlSafe(
              'inbound_transfer_notice',
              'Transferred from <a href="__account_url__">__account__</a>.', {
                account_url: '/accounts/' + targetAccount.id,
                account: targetAccount.label
              }
            )}
          </p>
        );
      }
      else {
        notice = (
          <p className="tx-transfer-notice">
            {t.htmlSafe(
              'outbound_transfer_notice',
              'Transferred to <a href="__account_url__">__account__</a>.', {
                account_url: '/accounts/' + targetAccount.id,
                account: targetAccount.label
              }
            )}
          </p>
        );
      }

      return notice;
    }
  });

  return Transaction;
});