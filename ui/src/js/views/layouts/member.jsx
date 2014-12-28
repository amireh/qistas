/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var Navigation = require('jsx!./member/navigation');
  var LoadingBar = require('jsx!views/loading_bar');
  var Notifications = require('jsx!views/notifications');

  var MemberLayout = React.createClass({
    mixins: [ React.addons.LayoutMixin, React.addons.ResponsiveMixin ],

    statics: {
      defaultOutlet: 'content',

      availableOutlets: function() {
        return [ 'content' ];
      }
    },

    getDefaultProps: function() {
      return {
        activeTheme: undefined,
        navbar: {
          item:  '',
          child: ''
        },
        showingJournal: false,
        user: {}
      };
    },

    render: function() {
      return(
        <div>
          {this.props.loading && <LoadingBar key="loadingBar" />}

          <Navigation
            name={this.props.user.name}
            email={this.props.user.email} />

          <div key="content" id="content" className="content">
            <Notifications
              key="notifications"
              updateAvailable={this.props.updateAvailable}
              notifications={this.props.notifications} />

            {this.renderOutlet('content')}
          </div>
        </div>
      );
    }
  });

  return MemberLayout;
});