/**
 * @class lodash
 *
 * Pibi.js lodash extensions.
 */
define([ 'underscore', 'config' ], function(_, config) {
  var defer = _.defer;
  var slice = Array.prototype.slice;

  var precision = Math.pow(10, config.precision || 2);

  _.toFloat = function(n) {
    return Math.round(parseFloat(n) * precision) / precision;
  };

  _.toBoolean = function(v) {
    if (v === 'true') { return true; }
    else if (v === 'false') { return false; }
    else { return !!v; }
  };

  /**
   * @method randomChar
   *
   * A random alphabetical uppercase letter.
   *
   * @return {String}
   * The character.
   */
  _.randomChar = function() {
    return String.fromCharCode(_.random(26)+65); //A-Z
  };

  /**
   * @method sanitize
   *
   * Sanitize a string by removing non-word characters, and by grouping consecutive
   * occurencies of a certain delimiter.
   *
   * @param  {String} str The string to sanitize.
   * @param  {String} [delim='-'] The delimiter to group.
   * @return {String}
   * The sanitized version.
   */
  _.sanitize = function(str, delim) {
    delim = delim || '-';

    return (str||'')
      .toLowerCase()
      .replace(/\W/, delim)
      .replace(RegExp(delim + '+'), delim);
  };

  _.zipPairs = function(/* arrays */) {
    return slice.call(arguments).reduce(function(hsh, pair) {
      hsh[pair[0]] = pair[1];
      return hsh;
    }, {});
  };

  // alias
  _.findBy = _.findWhere;

  return _;
});