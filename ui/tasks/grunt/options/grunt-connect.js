var grunt = require('grunt');
var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;

var middleware = function(connect, options) {
  var middlewares = [];

  // ReverseProxy support
  middlewares.push( proxy );

  // RewriteRules support
  middlewares.push(rewriteRulesSnippet);

  if (!Array.isArray(options.base)) {
    options.base = [options.base];
  }

  var directory = options.directory || options.base[options.base.length - 1];
  options.base.forEach(function (base) {
    // Serve static files.
    middlewares.push(connect.static(base));
  });

  // Make directory browse-able.
  middlewares.push(connect.directory(directory));

  return middlewares;
};

module.exports = {
  rules: [
    {
      from: '^/en/(.*)$',
      to: '/#/en/$1'
    },

    {
      from: '^/app/',
      to: "/apps/<%= grunt.config.get('currentApp') %>/js/",
    },

    {
      from: '^/fixtures/',
      to: "/apps/<%= grunt.config.get('currentApp') %>/test/fixtures/"
    },

    {
      from: "^/apps/<%= grunt.config.get('currentApp') %>/js/<%= grunt.config.get('pkg.name') %>/",
      to: '/apps/common/js/'
    }
  ],

  www: {
    proxies: [{
      context: '/api/v1',
      host: 'localhost',
      port: 3000,
      https: false,
      changeOrigin: false,
      xforward: false
    }],

    options: {
      keepalive: false,
      port: 8000,
      base: 'www',
      middleware: middleware
    }
  },

  tests: {
    options: {
      keepalive: false,
      port: 8001,
      hostname: '*'
    }
  },

  docs: {
    options: {
      keepalive: true,
      port: 8001,
      base: "doc"
    }
  },

  browser_tests: {
    options: {
      keepalive: true,
      port: 8002
    }
  },

  coverage: {
    options: {
      port: 8003,
      hostname: '127.0.0.1',
      middleware: function (connect, options) {
        // 2. get sources to be instrumented from the config
        //    you may need to adjust this to point to the correct option
        var src = grunt.file.expand(grunt.config.get('jasmine.coverage.src')).reduce(function(set, file) {
          return set.concat('/' + file);
        }, []);

        var staticFiles = connect.static(String(options.base));
        return [
          function (request, response, next) {
            if (src.indexOf(request.url) > -1) {
              // redirect to instrumented source
              request.url = '/.grunt/grunt-contrib-jasmine' + request.url;
            }
            return staticFiles.apply(this, arguments);
          }
        ];
      }
    }
  }
};
