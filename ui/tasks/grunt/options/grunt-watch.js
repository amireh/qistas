module.exports = {
  options: {
    spawn: false,
  },

  // lint: {
  //   files: [ 'src/js/**/*.js' ],
  //   tasks: [ 'newer:jshint' ]
  // },

  css: {
    files: '{apps/*,src,vendor}/css/**/*.{less,css}',
    tasks: [ 'less', 'notify:less' ]
  },

  compiled_css: {
    files: 'www/dist/app.css',
    tasks: [ 'noop' ],
    options: {
      livereload: {
        port: 9124
      }
    }
  },

  locales: {
    files: 'www/assets/locales/**/*.yml',
    tasks: [ 'compile:locales', 'notify:locales' ]
  },

  docs: {
    files: [ '.jsduck', 'doc/guides/**/*.md', 'doc/*.*' ],
    tasks: [ 'docs', 'notify:docs' ]
  },

  // jsx: {
  //   files: 'src/js/**/*.jsx',
  //   tasks: [ 'newer:react', 'jshint:jsx' ]
  // },

  tests: {
    options: {
      spawn: false,
    },

    files: [
      'apps/*/{js,test}/**/*.j{s,sx}',
      'src/js/**/*.j{s,sx}',
      'test/**/*',
    ],

    tasks: [ "jasmine:<%= grunt.config.get('currentApp') %>" ],
  }
};
