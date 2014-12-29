/**
 * Pixy initializer.
 */
define(function(require) {
  var require = require('require');
  var RSVP = require('rsvp');
  var Pixy = require('ext/pixy');
  var $ = require('ext/jquery/CORS');
  var SessionStore = require('stores/sessions');
  var Store = require('store');
  var K = require('constants');
  var t = require('i18n!common');
  var AppLoader = require('core/app_loader');
  var K = require('constants');

  'use strict';

  // Install Cache storage adapter
  Pixy.Cache.setAdapter(Store);
  Pixy.Cache.setAvailable(Store.enabled);

  // Use the CORS version of ajax
  Pixy.ajax = $.ajaxCORS;

  Pixy.configure({
    NEW_MODEL_ID: K.NEW_MODEL_ID,

    isAuthenticated: function() {
      return SessionStore.isActive();
    },

    getRootRoute: function() {
      return Pixy.routeMap.root;
    },

    getCurrentLayoutName: function() {
      return SessionStore.isActive() ?
        K.PRIVATE_LAYOUT_NAME :
        K.PUBLIC_LAYOUT_NAME;
    },

    getDefaultWindowTitle: function() {
      return t('window_title', 'Pibi - Personal Finance');
    },

    loadRoute: function(url, onLoad) {
      var appName = url.split(/\/|\?/)[1];

      console.debug('Checking if we have an app that hosts "%s"', appName);

      if (AppLoader.hasApp(appName) && !AppLoader.isLoaded(appName)) {
        console.debug('Loading app %s', appName);

        return AppLoader.load(appName).then(function(app) {
          console.debug('\tApp has been loaded. Resuming transition...');
          onLoad();
        }, function(e) {
          console.warn('\tApp loading failed:', e);
          onLoad();
        });
      }

      onLoad();
    }
  });

  // Pixy.Registry.options.mute = true;
});