define([
  'routes/base',
  'jsx!../../views/oauth/success'
], function(Route, View) {
  new Route('oauthSuccess', {
    enter: function() {
      this.replaceWith('/');
      // this.mount(View);
    },

    exit: function() {
      // this.unmount(View);
    }
  });
});