define(function(require) {
  var K = require('constants');
  var Dispatcher = require('core/dispatcher');
  var TransactionStore = require('stores/transactions');
  var t = require('i18n!transactions');
  var Notifier = require('modules/notifier');

  var actions = {
    add: function(type) {
      Dispatcher.dispatch('transactions:add', type);
    },

    addExpense: function() {
      Dispatcher.dispatch('transactions:add', K.TX_EXPENSE);
    },

    addIncome: function() {
      Dispatcher.dispatch('transactions:add', K.TX_INCOME);
    },

    addTransfer: function() {
      Dispatcher.dispatch('transactions:add', K.TX_TRANSFER);
    },

    changeType: function(newType) {
      Dispatcher.dispatch('transactions:changeType', newType);
    },

    activate: function(id) {
      Dispatcher.dispatch('transactions:activate', { id: id });
    },

    edit: function() {
      Dispatcher.dispatch('transactions:edit');
    },

    stopEditing: function() {
      Dispatcher.dispatch('transactions:stopEditing');
    },

    restore: function() {
      return Dispatcher.dispatch('transactions:restore').promise;
    },

    save: function(props) {
      return Dispatcher.dispatch('transactions:save', props).promise;
    },

    transfer: function(props) {
      return Dispatcher.dispatch('transactions:transfer', props).promise;
    },

    destroy: function() {
      var confirmationMessage = t(
        'confirmations.remove',
        'Are you sure you want to remove this transaction?'
      );

      if (TransactionStore.getActiveId()) {
        if (confirm(confirmationMessage)) {
          Dispatcher.dispatch('transactions:destroy').promise.then(function() {
            Notifier.success(t('notifications.removed', 'Transaction has been removed.'));
          });
        }
      }
    },

    generateCSV: function() {
      return Dispatcher.dispatch('transactions:csv').promise;
    },

    loadMore: function() {
      if (TransactionStore.canLoadMore()) {
        TransactionStore.loadMore();
      }
    }
  };

  return actions;
});