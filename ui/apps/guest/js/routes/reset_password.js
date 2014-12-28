define([
  'routes/secondary',
  'jsx!../views/reset_password',
], function(SecondaryRoute, View) {
  new SecondaryRoute('resetPassword', {
    views: [{
      component: View,
      into: 'dialogs'
    }]
  });
});