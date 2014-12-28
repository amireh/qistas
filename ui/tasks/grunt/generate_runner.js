var fs = require('fs');
var grunt = require('grunt');
var path = require('path');

var configPath = function(filename) {
  return path.join(__dirname, '..', '..', 'config', 'requirejs', filename);
};

var requireConfig = function(filename) {
  return require(configPath(filename));
};

var generateRunner = function(target, dest) {
  var config, template, templateData, runner;

  if (target === 'development') {
    config = requireConfig('main_development');
    template = grunt.file.read('config/requirejs/runner_development.tmpl.js');
  }
  else if (target === 'production') {
    config = requireConfig('main_production');
    template = grunt.file.read('config/requirejs/runner.tmpl.js');
  }
  else {
    throw new Error("Unknown target '" + target + "' for runner generation.");
  }

  templateData = {
    data: {
      requirejsConfig: JSON.stringify(config)
    }
  };

  runner = grunt.template.process(template, templateData);

  if (dest) {
    grunt.file.write(dest, runner);
  }

  return runner;
};

module.exports = {
  description: 'Generate the JS runner for either development or production.',
  generateRunner: generateRunner,
  runner: function(grunt, target) {
    var dest = 'www/dist/app.js';

    console.log('Runner generated at', dest);

    if (target === 'development') {
      generateRunner('development', dest);
    }
    else if (target === 'production') {
      generateRunner('production', dest);
    }
    else {
      grunt.log.fatal('Unknown target "' + target + '". Known targets are: development, production');
    }
  }
};