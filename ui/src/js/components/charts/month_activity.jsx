/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ChartMixin = require('mixins/components/chart');
  var d3 = require('d3');
  var moment = require('moment');
  var _ = require('underscore');
  var BalanceCalculator = require('models/balance_calculator');
  var pluck = _.pluck;
  var findBy = _.findWhere;

  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (!!(word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  var MonthActivityChart = React.createClass({
    mixins: [ ChartMixin.mixin ],

    getDefaultProps: function() {
      return {
        transactions: [],

        /**
         * @property {Number} [barWidth=30]
         * Width of the bars in the chart in pixels.
         */
        barWidth: 10,

        /**
         * @property {Number} [barMargin=1]
         *
         * Whitespace to offset the bars by, in pixels.
         */
        barMargin: 10,
        xOffset: 24,
        linearScale: true,
        width: 'auto',
        height: 240,
        gridLineOffset: 24,
        yAxisTicks: 5,

        toDefaultCurrency: false,
        types: [ 'income', 'expense' ]
      };
    },

    createData: function(props) {
      var types = props.types;
      var baseDate;

      var transactions = props.transactions.filter(function(transaction) {
        return types.indexOf(transaction.type) > -1;
      });

      if (transactions.length) {
        baseDate = moment(transactions[0].occurredOn);
      }
      else {
        baseDate = moment();
      }

      var today = moment().startOf('day');
      var dayBalances = d3.range(1,baseDate.daysInMonth()+1).reduce(function(days, day) {
        var renderableDate;
        var date = baseDate.clone().startOf('day');

        date.date(day);

        renderableDate = date.toDate();
        renderableDate.isToday = today.isSame(date);

        days.push({
          date: renderableDate,
          id: date.unix(),
          sums: types.map(function(type) {
            return {
              name: type,
              value: 0
            };
          })
        });

        return days;
      }, []);

      transactions.forEach(function(transaction) {
        var txDate = moment(transaction.occurredOn).startOf('day');
        var daySet = findBy(dayBalances, { id: txDate.unix() });
        var amount;

        if (!daySet) {
          console.error('Unable to find day entry:', txDate);
          return;
        }

        amount = BalanceCalculator.balanceForSet(
          [ transaction ],
          props.toDefaultCurrency ? props.defaultCurrency : undefined
        );

        findBy(daySet.sums, { name: transaction.type }).value += amount;
      });

      return dayBalances;
    },

    getChartWidth: function() {
      var props = this.props;

      if (props.width === 'auto') {
        return this.getDOMNode().offsetWidth;
      }
      else {
        return parseInt(props.width, 10);
      }
    },

    getChartHeight: function() {
      return this.props.height;
    },

    createChart: function(node, props) {
      var margin = {top: 20, right: 20, bottom: 35, left: 40},
          width = this.getChartWidth() - margin.left - margin.right,
          height = this.getChartHeight() - margin.top - margin.bottom;

      var barWidth = props.barWidth;
      var barMargin = props.barMargin;
      var xOffset = props.xOffset;
      var yAxisTicks = props.yAxisTicks;
      var data = this.createData(props);
      var today = (moment().startOf('day')).toJSON();

      var x0 = d3.scale.ordinal()
          .rangeRoundBands([ 0, width ], 0.5);

      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x0)
          .orient("bottom")
          .tickFormat(d3.time.format('%a %d'));

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(d3.format(".2s"))
          .ticks(5)
          .tickSize(0,0);

      var svg = d3.select(node)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x0.domain(data.map(function(d) { return d.date; }));
      x1.domain(props.types).rangeRoundBands([0, x0.rangeBand()]);

      y.domain([
        0,
        d3.max(data, function(d) {
          return d3.max(d.sums, function(dy) {
            return dy.value;
          });
        })
      ]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(-3," + height + ")")
          .call(xAxis)
            .selectAll(".tick text")
            .attr('class', function(d) {
              return d.isToday ? 'is-today' : null;
            })
            .call(wrap, 25);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "translate(-15," + (height + 32) + "), rotate(-90)")
          .attr("dy", ".71em")
          .style("text-anchor", "start")
          .text(props.defaultCurrency || 'USD')
          .attr('class', 'currency');

      var xGridLines = svg.selectAll('line.x_grid')
        .data(y.ticks(yAxisTicks))
        .enter().append('line')
          .attr('class', 'x_grid')
          .attr('x1', props.gridLineOffset)
          .attr('x2', width - props.gridLineOffset)
          .attr('y1', function(d) { return y(d); })
          .attr('y2', function(d) { return y(d); });

      var day = svg.selectAll(".day")
        .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) {
            return "translate(" + x0(d.date) + ",0)";
          });

      day.selectAll("rect.bar")
        .data(function(d) { return d.sums; })
        .enter().append("rect")
          .attr("width", x1.rangeBand())
          .attr("x", function(d) { return x1(d.name); })
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .attr('class', function(d) { return [ 'bar', d.name ].join(' '); });

      day.selectAll('rect.empty_bar')
        .data(data.filter(function(d) {
          return d3.sum(pluck(d.sums, 'value')) === 0;
        }))
        .enter().append('rect')
          .attr('class', 'empty_bar')
          .attr("width", x1.rangeBand())
          .attr("x", function(d) { return x1(d.name); })
          .attr("y", function(d) { return 0; })
          .attr("height", function(d) { return 3; });

      return svg;
    },

    render: function() {
      return(
        <div className="month-activity-chart">
          <svg ref="chart" />
        </div>
      );
    }
  });

  return MonthActivityChart;
});