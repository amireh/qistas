define(function(require) {
  var React = require('react');
  var $ = require('jquery');
  var _ = require('lodash');
  var throttle = _.throttle;
  var guid = 0;

  var getChartNode = function(component) {
    var ref = (component.refs || {}).chart || component;
    return ref.getDOMNode();
  };

  var ChartMixin = {
    defaults: {
      updateChart: function(props) {
        this.removeChart();
        this.__svg = this.createChart(getChartNode(this), props);
      },

      render: function() {
        return React.DOM.svg({ className: "chart" });
      },

      removeChart: function() {
        if (this.__svg) {
          this.__svg.remove();
          delete this.__svg;
        }
      },

      shouldComponentUpdate: function(nextProps/*, nextState*/) {
        this.updateChart(nextProps);
        return false;
      }
    },

    mixin: {
      getDefaultProps: function() {
        return {
          autoResize: true
        };
      },

      componentWillMount: function() {
        if (typeof this.createChart !== 'function') {
          throw new Error("ChartMixin: you must define a createChart() method that returns a d3 element");
        }

        if (!this.updateChart) {
          this.updateChart = ChartMixin.defaults.updateChart;
        }

        if (!this.removeChart) {
          this.removeChart = ChartMixin.defaults.removeChart;
        }

        if (!this.shouldComponentUpdate) {
          this.shouldComponentUpdate = ChartMixin.defaults.shouldComponentUpdate;
        }
      },

      componentDidMount: function() {
        var resize;
        var that = this;

        this.__svg = this.createChart(getChartNode(this), this.props);
        this.__guid = ++guid;

        if (this.props.autoResize) {
          resize = throttle(function() { that.updateChart(that.props); }, 500, {
            leading: false,
            trailing: true
          });

          $(window).on('resize.chart_mixin_' + this.__guid, resize);
        }
      },

      componentWillUnmount: function() {
        this.removeChart();

        if (this.props.autoResize) {
          $(window).off('resize.chart_mixin_' + this.__guid);
        }
      },

      getContainerWidth: function() {
        return $(getChartNode(this)).parent().outerWidth();
      }
    }
  };

  return ChartMixin;
});