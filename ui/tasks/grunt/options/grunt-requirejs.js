var grunt = require('grunt');
var path = require('path');
var fs = require('fs');
var generateRunnerTask = require(path.join(__dirname, '../generate_runner.js'));

var configPath = function(filename) {
  return path.join(__dirname, '..', '..', '..', 'config', 'requirejs', filename);
};

var requireConfig = function(filename) {
  return require(configPath(filename));
};

var buildConfig = requireConfig('main_development.js');
var productionConfig = requireConfig('main_production.js');
var vendorBundle = productionConfig.bundles.vendor;
var availableApps = JSON.parse(fs.readFileSync('config/available_apps.json', 'utf-8'));

module.exports = {
  compile: {
    options: {
      baseUrl: './tmp/js',
      dir: 'tmp/bundles',

      bundles: buildConfig.bundles,
      paths: buildConfig.paths,
      map: buildConfig.map,
      shim: buildConfig.shim,

      optimize: 'uglify',

      removeCombined: false,
      inlineText: true,
      inlineJSON: true,
      preserveLicenseComments: false,

      uglify: {
        toplevel: true,
        ascii_only: true,
        beautify: false,
        max_line_length: 1000,
        no_mangle: false
      },

      pragmas: {
        production: true
      },

      modules: [
        {
          name: 'vendor',
          create: true,
          include: vendorBundle
        },
        {
          name: 'main',
          create: true,

          include: [
            'config',
            'boot',
            'config/initializers/routes',
            'core/app'
          ],

          exclude: [ 'vendor', 'jsx' ],

          override: {
            wrap: {
              end: generateRunnerTask.generateRunner('production')
            }
          }
        }
      ].concat(availableApps.filter(function(app) {
        return !app.development_only;
      }).map(function(app) {
        var moduleId = 'apps/' + app.name + '/js/main';

        return {
          name: moduleId,
          include: [ moduleId ],
          exclude: [ 'vendor', 'main', 'jsx' ]
        };
      })),

      onBuildWrite: function (moduleName, path, singleContents) {
        return singleContents.replace(/(text!|jsx!|json!)/g, '');
      }
    }
  }
};