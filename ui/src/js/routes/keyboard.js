define([
  'routes/secondary',
  'i18n!dialogs/keyboard_shortcuts',
  'jsx!views/dialogs/keyboard_shortcuts',
], function(SecondaryRoute, t, Dialog) {
  new SecondaryRoute('keyboard', {
    views: [{
      component: Dialog,
      into: 'dialogs'
    }],

    windowTitle: function() {
      return t('window_title', 'Keyboard Shortcuts - Pibi');
    },
  });
});