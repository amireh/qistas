define(function(require, exports, module) {
  var Promise = require('./promise');
  var AppBundle = require('../bundles/apps');
  var Pixy = require('pixy');
  var AppActions = require('actions/app');
  var findBy = require('lodash').findWhere;
  var ApplicationRouter = Pixy.ApplicationRouter;

  var getLoader = function(name) {
    var spec = findBy(AppBundle, { name: name });

    if (!spec) {
      spec = AppBundle.filter(function(app) {
        return app.entryScripts && app.entryScripts.indexOf(name) !== -1;
      })[0];

      if (spec.developmentOnly && !module.loadDevelopmentApps) {
        spec = null;
      }

      if (!spec) {
        throw new Error(
          "App " + name + " could not be found. " +
          "Did you register it in the available_apps.json file?"
        );
      }
    }

    return spec;
  };

  var createApp = function(appType, topLevel) {
    var app = new appType();
    var nestedRouteMapper;

    ApplicationRouter.map(function(match) {
      match('/').to('root', function(match) {
        // Top-level apps will handle the route mapping entirely on their own,
        // because they need to map routes at the root level (/):
        if (topLevel) {
          return app.setup(match);
        }

        // If an app has a #setup routine defined, it means that it has
        // nested routes it needs to map. In that case, we'll provide it with
        // a match function and a default "blank" route (this is totally due
        // to router.js quirkiness) which it can override.
        //
        // READ THIS:
        //
        // The "/" route MUST be defined for other sibling/nested routes
        // to function:
        //
        //     match('/').to('app:something');
        //     match('/sibling').to('app:sibling');
        //
        // You can not map ('/sibling') without mapping an "index" ('/') route.
        if (app.setup) {
          nestedRouteMapper = app.setup.bind(app);
        }

        match('/' + app.name).to(app.getRootRouteName(), nestedRouteMapper);
      });
    });

    return app;
  };

  var loadApp = function(name) {
    var loader = getLoader(name);

    if (loader.instance) {
      return Promise.resolve(loader.instance);
    }

    return new Promise(function(resolve, reject) {
      loader.load().then(function(appType) {
        loader.instance = createApp(appType, loader.topLevel);
        resolve(loader.instance);
      }, reject);
    });
  };

  var isLoaded = function(name) {
    var loader = getLoader(name);

    return !!loader.instance;
  };

  return {
    load: loadApp,
    isLoaded: isLoaded,
    hasApp: function(name) {
      try { return !!getLoader(name); } catch(e) { return false; }
    }
  };
});