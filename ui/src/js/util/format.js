define([ 'ext/underscore', 'accounting' ], function(_, accounting) {
  var exports = {};

  var pad = function(number, digits) {
    digits = digits || 2;
    return (Array(digits).join('0') + (number + '')).slice(-2);
  };

  // TODO: format per-country/currency settings
  var money = function(amount, currency) {
    var options = {};

    if (currency) {
      options.format = '%v %s';
      options.symbol = currency;
    } else {
      options.format = '%v';
    }

    return accounting.formatMoney(amount, options);
  };

  exports.pad = pad;
  exports.money = money;

  return exports;
});