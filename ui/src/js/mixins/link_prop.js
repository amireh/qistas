define([ 'react' ], function(React) {
  var IDENTITY = function(v) { return v; };
  var toNumber = function(v) { return parseFloat(v); };

  return {
    getDefaultProps: function() {
      return {};
    },

    linkProp: function(propName, propType) {
      var props = {};
      var converter = IDENTITY;

      if (propType === 'number') {
        converter = toNumber;
      }

      return {
        value: this.props[propName],
        requestChange: function(value) {
          props[propName] = converter(value);
          this.saveProp(propName, value, props);
        }.bind(this)
      };
    }
  };
});