module.exports = {
  description: 'Build a production-ready version of Pibi.js.',
  runner: [
    'clean:development',
    'clean:compiled',
    'compile:locales',
    'compile:css',
    'copy:src',
    'compile:js',
    'copy:compiled_js'
  ]
};