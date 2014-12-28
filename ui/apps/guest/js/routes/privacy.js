define([ 'routes/base', 'jsx!../views/privacy', 'i18n!guest/privacy' ],
function(Route, View, t) {
  new Route('guest:privacy', {
    views: [{ component: View }],

    windowTitle: function() {
      return t('window_title', 'Privacy Policy - Pibi');
    }
  });
});