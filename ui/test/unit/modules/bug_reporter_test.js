define([ 'modules/bug_reporter' ], function(BugReporter) {
  describe('Modules::BugReporter', function() {
    it('should attach object states to a report', function() {
      var someObject = {
        dump: function() {
        }
      };

      spyOn(someObject, 'dump');
      spyOn(Pixy.Collection.prototype, 'create');

      BugReporter.addObject('someObject', someObject);
      BugReporter.create({
        fruit: 'apple'
      });

      expect(someObject.dump).toHaveBeenCalled();
      expect(Pixy.Collection.prototype.create).toHaveBeenCalled();
    });

    xit('should submit a report', function() {
      var dump;

      spyOn($, 'ajaxCORS');

      BugReporter.create({});

      expect($.ajaxCORS).toHaveBeenCalled();
      expect(BugReporter.length).toEqual(1);
    });

    xit('should create a report with useful data', function() {
      var someObject = {
        dump: function() {
          return {
            vegetable: 'lettuce'
          }
        }
      };

      spyOn($, 'ajaxCORS');

      BugReporter.addObject('someObject', someObject);
      BugReporter.create({
        fruit: 'apple'
      });

      var report = BugReporter.last().toJSON();

      expect(report.context).toBeTruthy();
      expect(report.context).toEqual({
        fruit: 'apple'
      });

      expect(report.someObject).toBeTruthy();
      expect(report.someObject).toEqual({
        vegetable: 'lettuce'
      });
    });

  });
});