module.exports = {
  soft_dev: {
    tasks: [ 'watch:css', 'watch:compiled_css', 'watch:locales' ],
    options: {
      logConcurrentOutput: true
    }
  }
};