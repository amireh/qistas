define([ 'models/time_partitioner' ], function(TimePartitioner) {
  describe('Models.TimePartitioner', function() {
    var subject;
    var pluck = _.pluck;
    var findBy = _.findBy;

    it('should partition by years', function() {
      subject = new TimePartitioner('years', function(item) {
        return item.date;
      });

      subject.add([
        { id: 1, date: new Date('04/25/2013') },
        { id: 2, date: new Date('08/24/2013') },
        { id: 3, date: new Date('04/25/2014') },
      ]);

      expect(subject.partitions.length).toEqual(2);
      expect(pluck(subject.partitions, 'id')).toEqual([ '2013', '2014' ]);

      expect(pluck(findBy(subject.partitions, { id: '2013' }).items, 'id'))
        .toEqual([ 1, 2 ]);

      expect(pluck(findBy(subject.partitions, { id: '2014' }).items, 'id'))
        .toEqual([ 3 ]);
    });

    it('should partition by months', function() {
      subject = new TimePartitioner('months', function(item) {
        return item.date;
      });

      subject.add([
        { id: 1, date: new Date('04/25/2013') },
        { id: 2, date: new Date('04/03/2013') },
        { id: 3, date: new Date('08/24/2013') },
        { id: 4, date: new Date('04/25/2014') },
      ]);

      expect(subject.partitions.length).toEqual(3);
      expect(pluck(subject.partitions[0].items, 'id')).toEqual([ 1, 2 ]);
      expect(pluck(subject.partitions[1].items, 'id')).toEqual([ 3 ]);
      expect(pluck(subject.partitions[2].items, 'id')).toEqual([ 4 ]);
    });

    it('should partition by days');
    it('should accept a custom format');
    it('should accept a custom formatter function');

    describe('#isEmpty', function() {
      it('should read how many items the partitioner is holding', function() {
        subject = new TimePartitioner('years', function(item) {
          return item.date;
        });

        expect(subject.isEmpty()).toEqual(true);

        subject.add([
          { id: 1, date: new Date('04/25/2013') }
        ]);

        expect(subject.isEmpty()).toEqual(false);
      });
    });
  });
});