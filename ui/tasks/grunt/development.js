var shell = require('shelljs');

module.exports = {
  description: 'Use the development, non-optimized JS sources.',
  runner: function(grunt) {
    grunt.task.run('clean:compiled');
    grunt.task.run('generate:runner:development');
    grunt.task.run('symlink:development');
    grunt.task.run('compile:css');
  }
};