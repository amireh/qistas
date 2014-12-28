/**
 * Paths to all the 3rd-party libraries we're using. Files referenced here will
 * be bundled into the vendor.js bundle during the optimization phase.
 *
 * In development, the vendor bundle is not generated and instead each of these
 * libraries will be downloaded on-demand using the paths below.
 *
 * Path is relative to /src/js.
 *
 * If you need to define any shims, do it in ./vendor_shim.js.
 *
 * @note
 *   You should only list the libraries you're actually using here. If something
 *   is no longer used, comment it out or remove its line.
 */
module.exports = {
  'react': '../../node_modules/react/dist/react-with-addons',

  // ------------------------------------------------------------------------
  // jQuery & Extensions
  // ------------------------------------------------------------------------
  'jquery': '../../vendor/js/jquery/jquery-2.0.2',
  'jquery.jquerypp': '../../vendor/js/jquery/jquerypp.custom',
  'jquery.scrollintoview': '../../vendor/js/jquery/jquery.scrollintoview',
  'jquery.qtip': '../../vendor/js/jquery/jquery.qtip',
  'chosen': '../../vendor/js/chosen',

  // ------------------------------------------------------------------------
  // Utility
  // ------------------------------------------------------------------------
  'store': '../../vendor/js/store',
  'lodash': '../../vendor/js/lodash/lodash.custom',
  'pikaday': '../../vendor/js/pikaday',
  'shortcut': '../../node_modules/kandie-shortcut/dist/shortcut',
  'inflection': '../../vendor/js/inflection',
  'moment': '../../vendor/js/moment.min',
  // 'uservoice': '../../vendor/js/uservoice',
  'd3': '../../vendor/js/d3.v3',
  'md5': '../../vendor/js/md5',
  'humane': '../../vendor/js/humane',
  'dropzone': '../../vendor/js/dropzone-amd-module',
  'accounting': '../../vendor/js/accounting',

  // ------------------------------------------------------------------------
  // Compatibility Layers
  // ------------------------------------------------------------------------
  'fastclick': '../../vendor/js/FastClick-0.6.9',
  'enquire': '../../vendor/js/enquire',
  'snap': '../../vendor/js/snap',

  // ------------------------------------------------------------------------
  // Pixy & Extensions
  // ------------------------------------------------------------------------
  'pixy': '../../node_modules/pixy/dist/pixy',
  'psync': '../../node_modules/psync/dist/psync',
  'faye': '../../vendor/js/faye',

  // ------------------------------------------------------------------------
  // Analytics
  // ------------------------------------------------------------------------
  'mixpanel': '../../vendor/js/mixpanel/mixpanel',
  'mixpanel-snippet': '../../vendor/js/mixpanel/mixpanel-snippet',

  // ------------------------------------------------------------------------
  // i18n
  // ------------------------------------------------------------------------
  'i18next': '../../vendor/js/i18next/i18next.amd-1.6.3',
};