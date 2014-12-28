define([
  'i18n!notifications/errors',
  'modules/notifier'
], function(t, Notifier) {

  /**
   * Mix this into a component that is expected to receive an "error" prop with
   * an error code / message which will be consumed and turned into an error
   * notification using the Notifier module.
   *
   * The error message will be i18ned in the "ns_notifications.errors" scope.
   *
   * @note
   * When we say the error will be consumed, it means the "error" prop will be
   * literally removed from the component as soon as the mixin handles it.
   */
  var ErrorNotifierMixin = {
    getDefaultProps: function() {
      return {
        error: undefined
      };
    },

    componentDidUpdate: function() {
      if (this.props.error) {
        Notifier.error(t(this.props.error, 'Something went wrong.'));

        this.setProps({
          error: undefined
        });
      }
    }
  };

  return ErrorNotifierMixin;
});