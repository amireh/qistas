define([
  'routes/secondary',
  'jsx!views/not_found'
], function(SecondaryRoute, View) {
  new SecondaryRoute('notFound', {
    views: [{
      component: View,
      into: 'dialogs'
    }]
  });
});