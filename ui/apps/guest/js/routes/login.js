define([
  'routes/secondary',
  'i18n!dialogs/login',
  'jsx!../views/login',
  'stores/sessions',
  'constants'
], function(SecondaryRoute, t, Dialog, Store, K) {
  new SecondaryRoute('login', {
    accessPolicy: 'public',
    views: [{
      component: Dialog,
      into: 'dialogs'
    }],

    windowTitle: function() {
      return t('window_title', 'Login - Pibi');
    }
  });
});