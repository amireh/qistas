/* global requirejs: false, jasmine: false */
requirejs.config({
  baseUrl: './src/js',
  map: {
    '*': {
      'test': '../../test',
      'fixtures': 'test/fixtures'
    }
  },

  paths: {
    'json': '../../vendor/js/require/json',
    'rsvp': '../../node_modules/pixy/dist/pixy',
    'router': '../../node_modules/pixy/dist/pixy',
    'pixy-jasmine': '../../node_modules/pixy/dist/pixy-jasmine',
    'jasmine_react': '../../node_modules/jasmine_react/dist/jasmine_react'
  },

  deps: [
    'json',
    'pixy-jasmine',
    'jasmine_react',
    'config'
  ],

  config: {
    'config': {
      environment: 'test'
    }
  }
});
