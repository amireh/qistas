/* global requirejs: false, jasmine: false */
requirejs.config({
  callback: function() {
    window.PIXY_TEST = window.__TESTING__ = true;

    // Avoid infinite loop in the pretty printer when trying to print objects with
    // circular references.
    jasmine.MAX_PRETTY_PRINT_DEPTH = 3;

    // Hide the global "launchTest" that the grunt-contrib-requirejs-template
    // unconditionally calls without respecting our callback. We must initialize
    // the app before any of the specs are run.
    var go = this.launchTest;
    this.launchTest = function() {};

    require([ 'test/boot' ], function(boot) {
      if (boot instanceof Function) {
        boot(go); // boot file is async
      }
      else {
        go(); // boot file is synchronous and requires no callback
      }
    });
  }
});