var _ = require('lodash');
var extend = _.extend;

/**
 * main_development.js
 *
 * This script generates the config to be used for the development version of
 * the app. It expects the source files are reachable on the webserver and it
 * does not use any pre-compiled bundles (like the vendor bundle.)
 *
 * Configuration defined here will *not* make it to the production version,
 * but it will be used during optimization.
 *
 * To get a working script out of this file, use the grunt task "generate:runner":
 *
 *     grunt generate:runner:development
 *
 * And you'll find the file at /src/js/main.js
 */
module.exports = {
  // In development, we provide symlinks to all source directories like /src/js,
  // /node_modules, and /apps.
  baseUrl: '/src/js',

  map: require('./common/map'),
  bundles: require('./common/bundles'),

  paths: extend({}, require('./vendor_paths'), {
    'text': '../../vendor/js/require/text',
    'i18n': '../../vendor/js/require/i18n',
    'jsx': '../../vendor/js/require/jsx',
    'json': '../../vendor/js/require/json',

    'apps': '../../apps',

    // must use modded version of JSXTransformer for "use strict" strings,
    // see https://github.com/philix/jsx-requirejs-plugin
    'JSXTransformer': '../../vendor/js/require/JSXTransformer',
    'diff': '../../vendor/js/deep-diff-0.1.4.min',

    'available_apps': 'config/available_apps.json',
  }),

  shim: extend({}, require('./vendor_shim'), {
    'defaultLocale': [],
    'diff': {
      exports: 'DeepDiff'
    },
  }),

  jsx: {
    fileExtension: '.jsx'
  },

  config: {
    'core/app_loader': {
      loadDevelopmentApps: true
    }
  },

  waitSeconds: 20
};