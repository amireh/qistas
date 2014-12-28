var startingRoute = window.location.pathname;
var startingSearch = window.location.search;
var locationReset;

jasmine.inspecting = startingSearch.match(/inspect=true/);

require([ 'core/dispatcher', 'jasmine_react' ], function(Dispatcher, ReactSuite) {
  var actionIndex = 0;

  ReactSuite.config.getSendActionSpy = function(subject) {
    var dispatch = Dispatcher.dispatch.bind(Dispatcher);

    return {
      original: dispatch,
      spy: spyOn(Dispatcher, 'dispatch')
    };
  };

  ReactSuite.config.decorateSendActionRc = function(promise) {
    return {
      index: ++actionIndex,
      promise: promise
    };
  };
});

afterEach(function() {
  clearTimeout(locationReset);
  locationReset = setTimeout(function() {
    console.debug('Resetting location.');
    window.location.hash = '';
    window.history.replaceState('', '', startingRoute + startingSearch);

    var filteredSpec = (startingSearch.match(/\?spec=([^\;|^]+)/) || [])[1];
    if (filteredSpec) {
      var $suite = $('a[href*="' + filteredSpec + '"]').closest('.suite');
      $suite.detach();
      $('.summary').empty().append($suite);
    }
  }, 1000);
});

require([ 'react', 'ext/jquery' ], function(React, $) {
  var fixture;

  $(window).on('submit', function(e) {
    return $.consume(e);
  });

  beforeEach(function() {
    fixture = document.body.appendChild(document.createElement('div'));
    fixture.className = 'fixture';
    fixture.id = 'jasmine_content';
    jasmine.fixture = fixture;
  });

  afterEach(function() {
    if (!jasmine.inspecting) {
      React.unmountComponentAtNode(fixture);

      if (fixture.remove) {
        fixture.remove();
      }
    }
  });
});

require([ 'modules/analytics' ], function(Analytics) {
  afterEach(function() {
    Analytics.adapter.events = [];
    Analytics.adapter.pageViews = [];
  });
});