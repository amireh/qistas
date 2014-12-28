define(function(require) {
  var enquire = require('enquire');
  var Pixy = require('pixy');
  var K = require('constants');
  var FastClick = require('fastclick');

  var Responsifier = Pixy.Object.extend({
    defaults: {
      platform: null
    },

    isMobile: function() {
      return this.platform === K.PLATFORM_MOBILE;
    },

    initialize: function() {
      var fastClick;
      var setPlatform = function(platform) {
        console.log('Platform has changed:', platform);
        this.platform = platform;
        this.trigger('change');
      }.bind(this);

      // Mobile:
      enquire.register('screen and (max-width: 480px)', {
        deferSetup : true,
        match : function() {
          setPlatform(K.PLATFORM_MOBILE);
          fastClick = FastClick.attach(document.body);
        },
        unmatch : function() {
          fastClick.destroy();
          fastClick = undefined;
        },
      });

      // Tablets:
      enquire.register('screen and (min-width: 481px) and (max-width: 768px)', {
        deferSetup : true,
        match : function() {
          setPlatform(K.PLATFORM_TABLET);
        },
        unmatch : function() {},
      });

      // Desktops:
      enquire.register('screen and (min-width: 769px)', {
        deferSetup : true,
        match : function() {
          setPlatform(K.PLATFORM_DESKTOP);
        },
        unmatch : function() {},
      }, true);
    }
  });

  return new Responsifier();
});