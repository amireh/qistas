module.exports = {
  src: {
    files: [
      {
        expand: true,
        flatten: false,
        cwd: 'src/js',
        dest: 'tmp/js/',
        src: [ '**/*' ]
      },
      {
        expand: true,
        flatten: false,
        dest: 'tmp/js/',
        src: [ 'apps/*/js/**/*' ]
      }
    ]
  },

  compiled_js: {
    files: [
      // includes files within path
      {
        expand: false,
        src: [ 'tmp/bundles/main.js' ],
        dest: 'www/dist/app.js'
      },

      {
        expand: false,
        src: [ 'tmp/bundles/vendor.js' ],
        dest: 'www/dist/vendor.js'
      },

      {
        expand: false,
        src: 'vendor/js/require.min.js',
        dest: 'www/dist/require.js'
      },

      {
        expand: true,
        cwd: 'tmp/bundles',
        src: [ 'apps/*/js/main.js' ],
        dest: 'www/dist/'
      }
    ]
  }
};