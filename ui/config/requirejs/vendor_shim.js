module.exports = {
  'jquery.jquerypp':        [ 'jquery' ],
  'jquery.scrollintoview':  [ 'jquery' ],
  'jquery.slider':          [ 'jquery' ],
  'jquery.qtip':            [ 'jquery' ],

  'chosen': {
    deps: [ 'jquery' ],
    exports: 'Chosen'
  },

  // 'uservoice': { exports: 'UserVoice' },

  'lodash':         { exports: '_' },
  'store':          { exports: 'store' },
  'shortcut':       { exports: 'shortcut' },
  'moment':         { exports: 'moment' },
  'md5':            { exports: 'md5' },
  'inflection':     [],
  'pikaday': { exports: 'Pikaday', deps: [ 'lodash', 'moment' ] },
  'd3': { exports: 'd3' },

  'accounting': { exports: 'accounting' },

  'faye': { exports: 'Faye' },
  'enquire': { exports: 'enquire' },
  'snap': { exports: 'Snap' },
  'fastclick': { exports: 'FastClick' },

  'mixpanel-snippet': [],
  'mixpanel': { deps: [ 'mixpanel-snippet' ] }
};