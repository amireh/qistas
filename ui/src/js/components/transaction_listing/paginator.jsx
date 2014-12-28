/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!components/transaction_listing');
  var Actions = require('actions/transactions');

  var Paginator = React.createClass({
    getDefaultProps: function() {
      return {
        remainder: 0,
        perPage: 0
      };
    },

    render: function() {
      var tooltipLabel = t('tooltips.load_more', {
        total: this.props.remainder,
        perPage: this.props.perPage
      });

      return(
        <button
          className="btn btn-default btn-bordered"
          onClick={this.loadMore}
          title={tooltipLabel}>
          {t('load_more', 'Load more')}
        </button>
      );
    },

    loadMore: function() {
      Actions.loadMore();
    }
  });

  return Paginator;
});