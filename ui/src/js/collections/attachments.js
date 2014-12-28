define([ 'ext/pixy', 'models/attachment' ], function(Pixy, Attachment) {
  return Pixy.Collection.extend({
    model: Attachment,
    url: function() {
      return this.transaction.get('links').attachments;
    }
  });
});
