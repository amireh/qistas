module.exports = {
  production: {
    options: {
      strictImports: true,
      paths: [ 'src/css' ],
      ieCompat: true,
      compress: true,
      cleancss: false
    },
    files: {
      'www/dist/app.css': 'src/css/app.less',
      'www/dist/app-rtl.css': 'src/css/app-rtl.less'
    }
  }
};