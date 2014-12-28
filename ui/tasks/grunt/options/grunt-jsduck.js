module.exports = {
  main: {
    src: [ 'src/js', 'src/css', 'tmp/compiled/**/*.js' ],
    dest: 'doc/api',
    options: {
      'title': 'Salati.js Reference',
      'builtin-classes': false,
      'color': true,
      'no-source': true,
      'tests': false,
      'processes': 4,
      'guides': 'doc/guides.json',
      'images': 'doc/images',
      'eg-iframe': 'doc/example-iframe.html',
      'head-html': 'doc/head.html',
      'warnings': [],
      'external': [
        'XMLHttpRequest',
        'jQuery',
        'jQuery.Event',
        '$',
        '_',
        'lodash',
        'Handlebars',
        'Pixy',
        'Pixy.Router',
        'Pixy.View',
        'Pixy.Model',
        'Pixy.DeepModel',
        'Pixy.Collection',
        'Pixy.Controller',
        'React',
        'Moment',
        'qTip'
      ]
    }
  }
};
