var shell = require('shelljs');

module.exports = {
  description: 'Compile .yml locales into .json ones for i18next.',

  /**
   * Generate locales.
   *
   * @param  {String} locale
   * Locale two-character code (ie, `en` or `ar`).
   */
  runner: function(grunt, locale) {
    shell.exec('bin/compile-locales ' + (locale || ''));
  }
};