module.exports = {
  description: 'Serve Pibi.js using a local Connect server.',
  runner: function(grunt, appName) {
    if (appName) {
      var availableApps = grunt.file.expand('apps/*').filter(function(name) {
        return name !== 'apps/common';
      }).map(function(name) {
        return name.substr(5);
      });

      if (availableApps.indexOf(appName) === -1) {
        grunt.fail.fatal(
          "You must specify an app name to serve.\n" +
          "Available apps are: " + JSON.stringify(availableApps) + "\n" +
          "For example: `grunt server:" + availableApps[0] + "`"
        );
      }

      grunt.config.set('currentApp', appName);
    }

    grunt.task.run([
      'configureRewriteRules',
      'configureProxies:www',
      'development',
      'connect:www',
      'connect:tests',
      'watch'
    ]);
  }
};