define(function(require) {
  var Currencies = require('collections/currencies');
  var toAccountCurrency = function(amount, currency, account) {
    return account.currency.from(amount, currency || 'USD');
  };

  /**
   * Add the transaction's signed amount to our balance.
   *
   * @param {Account} account
   *
   * @private
   */
  var addToAccountBalance = function(account, signedAmount) {
    account.set({
      balance: account.get('balance') + signedAmount
    });
  };

  /**
   * Adjust the account balance when a transaction has been modified by first
   * deducting its original amount, and then adding its new amount.
   *
   * @param {Account} account
   * @param {Object} prev
   *        Previous attributes as received from the server.
   *
   * @private
   */
  var adjustAccountBalance = function(account, current, prev, coefficient) {
    var oldAmount, newAmount, delta;

    oldAmount = toAccountCurrency(prev.amount, prev.currency, account);
    oldAmount *= coefficient;

    newAmount = toAccountCurrency(current.amount, current.currency, account);
    newAmount *= coefficient;

    delta = newAmount - oldAmount;

    account.set({
      balance: account.get('balance') + delta
    });
  };

  /**
   * Remove the transaction's signed amount from the account balance.
   *
   * @param {Account} account
   * @param {Number} signedAmount
   *
   * @private
   */
  var deductFromAccountBalance = function(account, signedAmount) {
    account.set({
      balance: account.get('balance') + signedAmount
    });
  };

  return {
    toAccountCurrency: toAccountCurrency,
    addToAccountBalance: addToAccountBalance,
    adjustAccountBalance: adjustAccountBalance,
    deductFromAccountBalance: deductFromAccountBalance,

    balanceForSet: function(transactions, currencyIsoCode, signedAmount) {
      var shouldConvert = !!currencyIsoCode;
      var defaultCurrency = Currencies.get(currencyIsoCode);

      if (shouldConvert && !defaultCurrency) {
        console.warn(
          'You are attempting to convert to a currency %s but it is',
          'not recognized. Balance will be in original currency rate.',
          currencyIsoCode);
      }

      return transactions.reduce(function(sum, transaction) {
        var amount = transaction.amount;

        if (!amount) {
          return sum;
        }

        if (shouldConvert) {
          amount = defaultCurrency.from(amount, transaction.currency);
        }

        if (signedAmount) {
          amount *= transaction.coefficient;
        }

        return sum += amount;
      }, 0);
    }
  };
});