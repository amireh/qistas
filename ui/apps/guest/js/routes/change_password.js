define([
  'routes/secondary',
  'jsx!../views/change_password',
], function(SecondaryRoute, View) {
  new SecondaryRoute('changePassword', {
    views: [{
      component: View,
      into: 'dialogs'
    }]
  });
});