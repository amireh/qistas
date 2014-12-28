define(function(require) {
  var Subject = require('jsx!components/transaction_listing/transaction');

  describe('Components::TransactionListing::Transaction', function() {
    this.reactSuite({
      type: Subject
    });

    it('should render', function() {
      expect(subject.isMounted()).toEqual(true);
    });

    it('should notify that the transaction is not committed', function() {
      setProps({
        committed: false
      });

      expect(find('.tx-upcoming-notice')).toBeTruthy();
      expect(subject.getDOMNode().className).toMatch('is-upcoming');
    });
  });
});