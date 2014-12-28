var shell = require('shelljs');

module.exports = {
  description: 'Build a Phonegap Build version of Pibi.js.',
  runner: function(grunt) {
    grunt.task.run('copy:phonegap');
    grunt.task.run('string-replace:phonegap');
    grunt.task.run('compress:phonegap');
  }
};