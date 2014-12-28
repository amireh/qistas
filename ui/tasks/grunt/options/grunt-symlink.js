module.exports = {
  options: {
    overwrite: true
  },

  development: {
    files: [{
      expand: true,
      cwd: './',
      src: [ 'apps', 'node_modules', 'src', 'vendor' ],
      dest: 'www/'
    }]
  },

  assets: {
    src: 'www/assets',
    dest: 'assets'
  }
};