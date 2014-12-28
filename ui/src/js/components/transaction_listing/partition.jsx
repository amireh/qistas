/** @jsx React.DOM */
define([ 'react', 'moment', 'jsx!components/balance' ], function(React, moment, Balance) {
  var Partition = React.createClass({
    getDefaultProps: function() {
      return {
        id: moment().format('MMMM')
      };
    },
    render: function() {
      return (
        <div  className="segment"
              data-type="drilldown_segment"
              data-order={this.props.position}
              data-sort-on="li[data-type]">
          <h4 className="segment-header">
            {this.props.id}

            <div className="pull-right">
              <Balance
                amount={this.props.balance}
                upcomingAmount={this.props.upcomingBalance}
                currency={this.props.currency} />
            </div>
          </h4>

          <ul className="tx-listing">
            {this.props.children}
          </ul>
        </div>
      );
    }
  });

  return Partition;
});