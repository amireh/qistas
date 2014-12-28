var _ = require('lodash');
var vendor = require('./vendor_paths');
var extend = _.extend;

module.exports = {
  baseUrl: '/dist',
  map: require('./common/map'),

  bundles: extend({}, require('./common/bundles'), {
    // This is so that any request for a 3rd-party dependency is resolved from
    // inside the generated vendor bundle.
    //
    // E.g, a request for "lodash" would lookup the /dist/vendor.js file and
    // look for a module named "lodash" exported *inside* that file.
    vendor: require('./vendor_bundle')
  }),

  // Load the vendor bundle before anything:
  deps: [ 'vendor' ]
};