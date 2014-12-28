define([ 'ext/underscore', 'ext/pixy' ], function(_, Pixy) {

  /**
   * @class  Pibi.Models.Attachment
   * @extends Pixy.Model
   *
   * A file or email attachment.
   */
  return Pixy.Model.extend({
    name: 'Attachment',

    urlRoot: function() {
      return this.collection.transaction.get('links').attachments;
    }
  });
});