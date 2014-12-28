define(function(require) {
  var $ = require('ext/jquery');

  return {
    componentDidMount: function() {
      $(this.getDOMNode()).find('[title]').qtip({
        prerender: false,
        position: {
          my: 'top center',
          at: 'bottom center',
        }
      });
    },

    componentWillUnmount: function() {
      $(this.getDOMNode()).find('[title]').qtip('destroy', true);
    }
  };
})