define(function(require) {
  var Subject = require('app/stores/prayers');
  var moment = require('moment');

  describe('Stores::Prayers', function() {
    beforeEach(function() {
      Subject.reset();
    });

    describe('#getPrayersInMonth', function() {
      it('should include all days, even if empty', function() {
        var output = Subject.getPrayersInMonth(2014, 0);
        expect(output.length).toEqual(31);
      });

      it('should work for any given month', function() {
        Subject.state.prayers.push({
          date: moment.utc([ 2014, 0, 3 ]).toJSON(),
          type: 'fajr'
        });

        var output = Subject.getPrayersInMonth(2014, 0);
        console.log(JSON.stringify(output))
        expect(output[2].length).toEqual(1);
      });

      it('should work for the current month', function() {
        var today = moment();
        var remainingDays = today.daysInMonth() - today.date();

        var output = Subject.getPrayersInMonth(today.year(), today.month());
        expect(output.length).toEqual(today.daysInMonth() - remainingDays);
        console.log(JSON.stringify(output))
      });

      it('should exclude future days');
    });
  });

});