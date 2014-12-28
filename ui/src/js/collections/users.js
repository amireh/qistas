define([ 'ext/pixy', 'models/user' ], function(Pixy, User) {

  /**
   * @class Pibi.UsersCollection
   * @extends Pixy.Collection
   *
   * Users.
   */
  return Pixy.Collection.extend({
    id: 'UsersCollection',
    model: User,

    journal: {
      scope: 'user',
      collection: 'users'
    }
  });
});
