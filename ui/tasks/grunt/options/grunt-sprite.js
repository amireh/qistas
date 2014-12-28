module.exports = {
  all: {
    src: [
      'tmp/assets/images/themes/thumbnails/*',
    ],

    destImg: 'www/assets/images/theme-sprite.png',
    destCSS: 'src/css/themes/sprite.less',
    engine: 'gm',
    engineOpts: {
      imagemagick: true
    },

    imgOpts: {
      format: 'png',
      quality: 100,
    },

    padding: 4,

    algorithm: 'binary-tree',
    cssFormat: 'less',
    cssOpts: {
      // CSS template allows for overriding of CSS selectors
      cssClass: function (item) {
        return '.theme-thumbnail-' + item.name;
      }
    }
  }
};