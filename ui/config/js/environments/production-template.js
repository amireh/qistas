/* src/js/config/environments/production.js */
define({
  apiHost: '',

  xhr: {
    timeout: 15000,
  },

  faye: {
    host: '',
    timeout: 120,
    retry: 5
  },

  oauth: {
    facebook: '',
    google: ''
  },

  mixpanel: {
    namespace: 'pibi',
    token: ''
  }
});