define([ 'rsvp' ], function(RSVP) {
  RSVP.configure('onerror', function(e) {
    console.error("[DEBUG]: RSVP error:", JSON.stringify(e));
  });

  return {
    apiHost:   '/api',

    oauth: {
      facebook: '/api/auth/facebook',
      google: '/api/auth/google_oauth2'
    },

    xhr: {
      timeout: 1000
    },

    faye: {
      host: '/faye',
      timeout: 1
    },

    analyticsAdapter: 'test'
  };
});
