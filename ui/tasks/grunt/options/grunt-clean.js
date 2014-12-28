module.exports = {
  options: {
    force: false
  },

  compiled_symlink: [ 'src/js/compiled' ],
  compiled_jsx: [ 'tmp/js/compiled' ],
  compiled_assets: [ 'tmp/assets' ],
  compiled: [
    'tmp/assets',
    'tmp/bundles',
    'tmp/js',
    'www/dist/apps',
    'www/dist/app.js',
    'www/dist/app.css',
    'www/dist/vendor.js',
  ],

  assets: [ './assets' ],

  development: [
    'www/apps',
    'www/node_modules',
    'www/src',
    'www/vendor',
  ]
};