/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var $ = require('jquery');
  var Nav = require('jsx!./guest/nav');
  var Footer = require('jsx!./guest/footer');
  var Notifications = require('jsx!views/notifications');

  var GuestLayout = React.createClass({
    mixins: [ React.addons.LayoutMixin ],
    statics: {
      defaultOutlet: 'content',

      availableOutlets: function() {
        return [ 'content' ];
      }
    },

    componentDidMount: function() {
      $(document.body).addClass('guest');
    },

    componentWillUnmount: function() {
      $(document.body).removeClass('guest');
    },

    render: function() {
      var isMobile = this.props.platform === 'mobile';

      if (this.constructor.isEmpty(this.props)) {
        return <Nav />;
      }

      return(
        <div>
          {!isMobile && <Nav />}

          <main>
            <Notifications
              key="notifications"
              updateAvailable={this.props.updateAvailable} />

            <div id="content">
              {this.renderOutlet('content', { key: 'content' })}
            </div>

            <Footer key="footer" />
          </main>
        </div>
      );
    }
  });

  return GuestLayout;
});