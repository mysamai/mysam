var iTunesControl = require("itunescontrol");
var itunes = require('playback');

iTunesControl.search("hazel grey", function (results) {

  console.log("RESULTS!", results);

  iTunesControl.play(results[1].id);

  setTimeout(function() {
    itunes.pause();
  }, 10000);
  itunes.on('playing', function(data){
    itunes.currentTrack(function() {
      console.log(arguments);
    });
  });
  // itunes.on('paused', function(data){ console.log('paused');} );
  // itunes.play();
});