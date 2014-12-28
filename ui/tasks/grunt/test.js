module.exports = {
  description: 'Build an optimized version of Pibi.js JavaScript sources.',
  runner: function(grunt, target) {
    // Coverage tests need the compiled JSX:
    if (target === 'coverage') {
      grunt.task.run('clean:compiled');
      grunt.task.run('generate:runner:development');
      grunt.task.run('react');
      grunt.task.run('copy:src');
      grunt.task.run('compile:css');
    }

    grunt.task.run('symlink:assets');
    grunt.task.run('connect:' + (target === 'coverage' ? 'coverage' : 'tests'));
    grunt.task.run('jasmine:' + (target || ''));
    grunt.task.run('clean:assets');
  }
};