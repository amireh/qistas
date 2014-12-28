module.exports = {
  description: 'Build an optimized-version of Pibi.js.',
  runner: function (grunt, type) {
    grunt.task.run('test');

    if (!process.env.QUICK) {
      grunt.task.run('build');
    }

    grunt.task.run('bumpup:' + ( type || 'patch' ));
    grunt.task.run('updatePkg');
    grunt.task.run('string-replace:version');
    grunt.task.run('tagrelease');
  }
}