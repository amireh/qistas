define(function(require) {
  var CoreApp = require('core/app');
  var RootRoute = require('./route');
  var IndexRoute = require('./routes/index');
  var AboutRoute = require('./routes/about');
  var PrivacyRoute = require('./routes/privacy');
  var TermsRoute = require('./routes/terms');
  var SecurityRoute = require('./routes/security');
  var LoginRoute = require('./routes/login');
  var SignupRoute = require('./routes/signup');
  var ResetPasswordRoute = require('./routes/reset_password');
  var ChangePasswordRoute = require('./routes/change_password');
  var OAuthSuccessRoute = require('./routes/oauth/success');
  var OAuthFailureRoute = require('./routes/oauth/failure');

  return CoreApp.extend({
    name: 'guest',
    rootRoute: RootRoute,

    setup: function(match) {
      match('/welcome').to('guest:index');
      match('/privacy').to('guest:privacy');
      match('/terms').to('guest:terms');
      match('/security').to('guest:security');
      match('/about').to('guest:about');

      match('/login').to('login');
      match('/signup').to('signup');
      match('/reset_password').to('resetPassword');
      match('/change_password').to('changePassword');

      match('/oauth/failure/:provider').to('oauthFailure');
      match('/oauth/success/:provider').to('oauthSuccess');
    }
  });
});