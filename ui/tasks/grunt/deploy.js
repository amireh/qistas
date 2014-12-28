module.exports = {
  description: 'Build and deploy a production-ready version of Pibi.js.',
  runner: [ 'build', 'string-replace:enable_appcache' ]
};