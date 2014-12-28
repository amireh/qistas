define(function() {
  return function FakeXHRResponse(rc, body) {
    return [ rc, { 'Content-Type': 'application/json' }, JSON.stringify(body || {}) ];
  };
});