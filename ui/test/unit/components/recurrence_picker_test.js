define(function(require) {
  var Subject = require('jsx!components/recurrence_picker');
  var React = require('react');

  describe('Components.RecurrencePicker', function() {
    this.reactSuite({
      type: Subject
    });

    it('should render', function() {});
    it('should choose weeklyDays', function() {
      select('select:first', 'weekly');

      expect(subject.state.frequency).toEqual('weekly');
      expect(find('.days-of-week')).toBeTruthy();
      check('[value="sunday"]', true);
      check('[value="friday"]', true);

      expect(subject.state.weeklyDays).toEqual([ 'sunday', 'friday' ]);
    });

    it('should choose monthlyDays', function() {
      select('select:first', 'monthly');

      expect(subject.state.frequency).toEqual('monthly');
      expect(find('.days-of-month')).toBeTruthy();
      check('[value="1"]', true);
      check('[value="17"]', true);

      expect(subject.state.monthlyDays).toEqual([ '1', '17' ]);
    });

    describe('Yearly', function() {
      it('should allow choosing a number of months and a day', function() {
        select('select:first', 'yearly');

        expect(subject.state.frequency).toEqual('yearly');
        expect(find('.days-of-month')).toBeTruthy();
        expect(find('.months-of-year')).toBeTruthy();

        check('.months-of-year [value="3"]');
        check('.months-of-year [value="7"]');
        check('.days-of-month [value="10"]');

        expect(subject.state.yearlyMonths).toEqual([ '3', '7' ]);
        expect(subject.state.yearlyDay).toEqual('10');
      });
    });
  });
});