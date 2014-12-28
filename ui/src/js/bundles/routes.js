define([
  'ext/pixy',
  'routes/root',
  'routes/not_found',
  'routes/index',
  'routes/logout',
  'routes/keyboard',
], function(Pixy) {
  return {
    routeMap: Pixy.routeMap,
    setup: function(router) {
      router.map(function(match) {
        match('/').to('root', function(match) {
          match('/').to('index');
          match('/logout').to('logout');
          match('/keyboard').to('keyboard');
          match('/*rogueRoute').to('notFound');
        });
      });
    }
  };
});