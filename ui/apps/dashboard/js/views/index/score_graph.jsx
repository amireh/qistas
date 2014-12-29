/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var d3 = require('d3');
  var moment = require('moment');
  var K = require('constants');
  var ChartMixin = require('mixins/components/chart');
  var _ = require('lodash');
  var diff = require('util/diff');
  var parseDate = d3.time.format("%m/%d/%Y").parse;
  var sortBy = _.sortBy;

  var ScoreGraph = React.createClass({
    mixins: [ ChartMixin.mixin ],

    getDefaultProps: function() {
      return {
        prayers: []
      };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      if (!!diff.rusDiff(nextProps.prayers, this.props.prayers)) {
        return ChartMixin.defaults.shouldComponentUpdate.call(this, nextProps, nextState);
      }
      else {
        return false;
      }
    },

    createChart: function(node, props) {
      var maxScore = props.maxScore;
      var margin = {top: 20, right: 20, bottom: 30, left: 50};
      var width = this.getContainerWidth();
      var height = 240;

      width -= margin.left + margin.right,
      height -= margin.top + margin.bottom;

      var svg = d3.select(node)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + ',' + margin.top + ")");

      var data = props.prayers.reduce(function(set, prayer) {
        if (!set.hasOwnProperty(prayer.normalizedDate)) {
          set[prayer.normalizedDate] = 0;
        }

        set[prayer.normalizedDate] += prayer.score;

        return set;
      }, {});

      data = Object.keys(data).map(function(date) {
        return {
          date: date,
          score: (parseFloat(data[date]) / maxScore) * 100.0
        };
      });

      var dateRange = d3.extent(props.prayers, function(prayer) {
        return moment(prayer.normalizedDate, K.API_DATE_FORMAT).toDate();
      });

      if (data.length) {
        var startDate = moment(dateRange[0]);
        var endDate = moment(dateRange[1]);
        var nrDays = endDate.diff(startDate, 'days');
        var dateStr;

        for (var i = 0; i < nrDays; ++i) {
          dateStr = startDate.format(K.API_DATE_FORMAT);

          if (!data.some(function(d) { return d.date === dateStr })) {
            data.push({ date: dateStr, score: 0 });
          }

          startDate.add(1, 'days');
        }
      }

      data.forEach(function(d) { d.date = parseDate(d.date); });
      data = sortBy(data, 'date');

      console.log(JSON.stringify(data, null, 2));

      var x = d3.time.scale()
        .range([ 0, width ]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var line = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.score); });

      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain(d3.extent(data, function(d) { return d.score; }));

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(function(p) { return p + '%'; });

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Score");

      svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

      return svg;
    },

    render: function() {
      return React.DOM.svg({ className: "ScoreGraph" });
    }
  });

  return ScoreGraph;
});