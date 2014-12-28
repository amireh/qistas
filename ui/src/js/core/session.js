define([ 'ext/pixy', 'collections/users' ], function(Pixy, Users) {
  /**
   * @class  Pibi.Core.Session
   * @extends Pixy.Model
   * @singleton
   *
   * An authenticated session with the Pibi API servers.
   */
  var Session = Pixy.Model.extend({
    name: 'Session',
    url: '/sessions',

    /**
      * Create a new Session with its own users collection.
      */
    initialize: function() {
      this.users = new Users([{}]);

      /**
       * @property {Models.User} user
       * The current user. Might not be an authentic one.
       */
      this.user = this.users.first();
    }
  });

  return new Session();
});
