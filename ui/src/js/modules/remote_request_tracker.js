define(function(require) {
  var $ = require('jquery');
  var _ = require('lodash');
  var uiController = require('core/ui_controller');

  var throttle = _.throttle;
  var graceThreshold = 500;
  var isLoading;
  var unmarker;

  var canUpdate = function() {
    return uiController.hasStarted();
  };

  var setLoadingState = function(isOn) {
    isLoading = isOn;

    return uiController.update({ loading: !!isOn });
  };

  var markLoading = function() {
    if (canUpdate() && !isLoading) {
      setLoadingState(true);
      return;
    }
  };

  var unmarkLoading = function() {
    if (unmarker) {
      return;
    }

    unmarker = setTimeout(function() {
      if (isLoading) {
        setLoadingState(false);
      }

      unmarker = clearTimeout(unmarker);
    }, graceThreshold);
  };

  $(document).ajaxStart(throttle(markLoading, graceThreshold, {
    leading: true
  }));

  $(document).ajaxStop(unmarkLoading);
});