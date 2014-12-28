define(function(require) {
  var AVAILABLE_APPS = require('json!config/available_apps');
  var Promise = require('core/promise');
  var recipeLoaders = [];
  var basePath = 'apps/';

  // console.log('Apps available:', AVAILABLE_APPS);

  recipeLoaders = AVAILABLE_APPS.reduce(function(set, recipe) {
    var name = recipe.name;

    return set.concat({
      name: name,
      entryScripts: recipe.entry_scripts,
      topLevel: recipe.top_level,
      developmentOnly: recipe.development_only,
      load: function() {
        return new Promise(function(resolve, reject) {
          require([ basePath + name + '/js/main' ], resolve, reject);
        });
      }
    });
  }, []);

  return recipeLoaders;
});