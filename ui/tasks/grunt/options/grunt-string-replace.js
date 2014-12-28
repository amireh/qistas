module.exports = {
  version: {
    files: {
      'www/index.html': "www/index.html",
      "src/js/version.js": "src/js/version.js"
    },
    options: {
      replacements: [{
        pattern: /\d\.\d{1,}\.\d+/,
        replacement: "<%= grunt.config.get('pkg.version') %>"
      }, {
        pattern: /version(\s*)=(\s*)\"\d\.\d{1,}\.\d+/,
        replacement: "version$1=$2\"<%= grunt.config.get('pkg.version') %>"
      }]
    }
  },

  enable_appcache: {
    files: {
      'www/index.html': 'www/index.html',
      'www/app.appcache': 'www/app.appcache',
    },
    options: {
      replacements: [{
        pattern: '<html>',
        replacement: '<html manifest="/app.appcache">'
      }, {
        pattern: '# VERSION X.Y.Z',
        replacement: "# VERSION <%= grunt.config.get('pkg.version') %>"
      }]
    }
  }
};