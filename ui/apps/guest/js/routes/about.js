define([ 'routes/secondary', 'jsx!../views/about', 'i18n!guest/about' ],
function(Route, View, t) {
  new Route('guest:about', {
    views: [{ component: View, into: 'dialogs' }],
    windowTitle: function() {
      return t('window_title', 'About - Pibi');
    }
  });
});