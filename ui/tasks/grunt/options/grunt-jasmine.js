var _ = require('lodash');
var fs = require('fs');
var grunt = require('grunt');
var glob = require('glob');
var merge = _.merge;
var config;

// Test config shared between all the app suites:
var SHARED_CONFIG = {
  timeout: 2500,

  host: "http://127.0.0.1:<%= grunt.config.get('connect.tests.options.port') %>/",

  template: require('grunt-template-jasmine-requirejs'),
  templateOptions: {
    deferHelpers: true,
    defaultErrors: true,

    requireConfigFile: [
      'www/dist/app.js',
      'test/config.js',
      'test/config-unit.js'
    ]
  },

  // we'll keep the generated runner in case you want to try the tests out in
  // a browser; run `grunt connect:tests:keepalive` and open a /tests.html
  keepRunner: true,
  outfile: 'tests.html',

  version: '2.0.0',

  styles: [ 'www/dist/app.css', 'test/overrides.css' ],
  helpers: [
    'test/helpers/test_fixtures.js',
    'test/helpers/test_controller.js',
    'test/support/store_suite.js',
  ]
};

var specs = [
  'test/unit/**/*_test.js'
];

var appNames = glob.sync('*', { cwd: 'apps' }).filter(function(appName) {
  var specs = glob.sync('**/*_test.js', { cwd: 'apps/' + appName + '/test' });
  if (specs.length) {
    return true;
  }
  else {
    grunt.log.warn("App '" + appName + "' does not have any tests defined.");
  }
});

var config = appNames.reduce(function(config, appName) {
  var pathTo = function(path) {
    return [ 'apps', appName, path ].join('/');
  };

  var configFile = pathTo('test/config.js');
  var cssFile = pathTo('test/overrides.css');
  var appConfig = merge({}, SHARED_CONFIG);

  appConfig.helpers = SHARED_CONFIG.helpers.concat([
    pathTo('test/helpers/*.js'),
  ]);

  appConfig.specs = [
    pathTo('test/**/*_test.js')
  ];

  if (fs.existsSync(cssFile)) {
    appConfig.styles = SHARED_CONFIG.styles.concat([ cssFile ]);
  }

  if (fs.existsSync(configFile)) {
    appConfig.templateOptions.requireConfigFile.push(configFile);
  }

  // this allows spec files to require() modules from the app's sources
  // directly without any prefix (or relative paths, for the matter):
  appConfig.templateOptions.requireConfig = {
    waitSeconds: 1,
    map: {
      '*': {
      }
    },
    paths: {
      'app': '../../' + pathTo('js')
    }
    // baseUrl: pathTo('js')
  };

  config[appName] = { options: appConfig };

  return config;
}, {});

config.common = {
  options: merge({}, SHARED_CONFIG, {
    specs: specs
  })
};

module.exports = config;