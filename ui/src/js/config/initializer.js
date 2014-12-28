define([
  'config/initializers/i18next',
  'config/initializers/jquery',
  'config/initializers/pixy',
  'config/initializers/moment',
  'config/initializers/pikaday',
  'config/initializers/dropzone',
  'config/initializers/d3',
  'config/initializers/psync',
  'config/initializers/shortcut',
  'config/initializers/analytics',
  'chosen',
  //>>excludeStart("production", pragmas.production);
  'config/initializers/debug',
  //>>excludeEnd("production");
],
function(loadLocale) {
  return loadLocale;
});