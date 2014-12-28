define(function(require) {
  var Psync = require('psync');
  var Messenger = require('core/messenger');

  Messenger.addHandler('journal_playback', function(journal, selfOrigin) {
    return Psync.Player.play(journal, selfOrigin);
  });
});