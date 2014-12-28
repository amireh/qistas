var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var template = require('lodash').template;
var transform = require('react-tools').transform;
var convertTextBlocks = require('canvas_react_i18n');

convertTextBlocks.configure({
  func: 't'
});

var processJSX = function(rawJSX) {
  // TODO: need to add support for wrappers in i18next to be able to utilize
  // the <Text /> component & react i18n converter:
  //
  // return transform(convertTextBlocks(rawJSX));

  return transform(rawJSX);
};

var compileJSX = function(srcDir, destDir) {
  if (!destDir) {
    destDir = srcDir;
  }

  glob.sync('**/*.jsx', { cwd: srcDir }).forEach(function(file) {
    var compiled, outfile;

    console.log('Compiling JSX:', file);

    compiled = processJSX(fs.readFileSync(path.join(srcDir, file), 'utf8'));
    outfile = path.join(destDir, file.replace(/\.jsx$/, '.js'));

    fs.ensureDirSync(path.dirname(outfile));
    fs.writeFileSync(outfile, compiled);

    fs.unlinkSync(path.join(destDir, file));
  });
};

module.exports = {
  description: 'Build an optimized version of Pibi.js JavaScript sources.',
  runner: function(grunt) {
    compileJSX('tmp/js');
    grunt.task.run('requirejs:compile');
  }
};