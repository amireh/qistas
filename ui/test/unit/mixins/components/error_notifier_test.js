define([
  'ext/react',
  'mixins/components/error_notifier',
  'modules/notifier'
 ], function(React, Mixin, Notifier) {
  describe('Mixins.Components.ErrorNotifier', function() {
    var subject;
    var Component = React.createClass({
      mixins: [ Mixin ],
      render: function() {
        return(
          React.DOM.div({})
        );
      }
    });

    it('should show an error notification', function() {
      subject = React.renderComponent(Component(), jasmine.fixture);

      spyOn(Notifier, 'error');

      subject.setProps({
        error: 'some_unused_i18n_key'
      });

      expect(Notifier.error).toHaveBeenCalledWith('Something went wrong.');
    });

    it('should consume the error once it shows it', function() {
      subject = React.renderComponent(Component(), jasmine.fixture);

      subject.setProps({
        error: 'some_unused_i18n_key'
      });

      expect(subject.props.error).toEqual(undefined);
    });
  });
});