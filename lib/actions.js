import Q from 'q';
import iTunesControl from 'itunescontrol';
import itunes from 'playback';

let pkg = require('../package.json');

module.exports = {
  itunes: function(result) {
    let deferred = Q.defer();
    let done = false;
    let check = () => {
      if(!done) {
        itunes.currentTrack(function(track) {
          deferred.resolve({ track });
          done = true;
        });
      }
    };

    if(result.tags.indexOf('pause') !== -1 || result.tags.indexOf('stop') !== -1) {
      itunes.pause(check);
    } else {
      itunes.on('playing', check);

      iTunesControl.search("hazel grey", function (results) {
        if(results && results.length) {
          let index = Math.round(Math.random() * (results.length - 1));
          iTunesControl.play(results[index].id);
        }
      });
    }

    return deferred.promise;
  },

  about: function(result) {
    let text = 'I am ';
    let description = pkg.description;

    text += description.charAt(0).toLowerCase() + description.slice(1);

    return Q({ text });
  },

  hi: function(result) {
    let tags = result.tags;
    let index = tags.indexOf('hi');
    let text = 'you';

    if (index === -1) {
      index = result.tags.indexOf('hello');
    }

    index = index + 2;

    if (index && tags[index]) {
      if (tags[index] === 'the') {
        index++;
      }
      text = tags.slice(index, tags.length).join(' ');
    }

    return Q({ text: `Hi ${text}!` });
  }
};
