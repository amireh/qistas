define([
  'routes/secondary',
  'i18n!dialogs/signup',
  'jsx!../views/signup',
  'constants'
], function(SecondaryRoute, t, View, UserStore, K) {
  new SecondaryRoute('signup', {
    accessPolicy: 'public',
    views: [{
      component: View,
      into: 'dialogs'
    }],

    windowTitle: function() {
      return t('window_title', 'Signup - Pibi');
    }
  });
});