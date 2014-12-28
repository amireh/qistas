define(function(require) {
  var $ = require('jquery');

  /**
   * @class Mixins.Components.FormKeySubmission
   *
   * Intercept all RETURN key events while editing a .form-input to submit the
   * form.
   */
  var FormKeySubmission = {
    componentDidMount: function() {
      var onKeySubmission = this.onKeySubmission;

      if (typeof this.onKeySubmission !== 'function') {
        throw 'Expected host component to define a #onKeySubmission method.'
      }

      $(this.getDOMNode()).on('keydown', 'input.form-input', function(e) {
        var $form, $primaryButton;

        if (e.which === 13) {
          $form = $(this).closest('form');
          $primaryButton = $form.find('[data-primary]');

          if ($primaryButton.length) {
            $.consume(e);
            onKeySubmission(e);
            return false;
          }
        }

        return true;
      });
    }
  };

  return FormKeySubmission;
});