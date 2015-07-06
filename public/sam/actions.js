import stache from 'can/view/stache/';
import 'sam/learner/';
const learner = stache('<sam-learner transcript="{recognition.transcript}"></sam-learner>');

const actions = {
  learn(el, result, state) {
    state.attr('listening', false);
    el.html(learner(state));
  },

  weather(el, result) {
    let index = result.pos.indexOf('IN');
    let location = null;

    if(index !== -1 && result.tags[index + 1]) {
      location = result.tags[index + 1];
    }

    const loadWeather = (location, woeid) => {
      $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'c',
        success: function(weather) {
          let html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
          html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
          html += '<li class="currently">'+weather.currently+'</li>';
          html += '<li>'+weather.alt.temp+'&deg;C</li></ul>';

          el.html(html);
        },
        error: function(error) {
          el.html('<p>'+error+'</p>');
        }
      });
    };

    if(location) {
      loadWeather(location, '');
    } else {
      navigator.geolocation.getCurrentPosition(function(position) {
        loadWeather(position.coords.latitude+','+position.coords.longitude);
      });
    }
  },

  shutdown(el, result, state) {
    state.attr('recognition').stop();
    let name = $('<h1 class="fadeIn animated">').html('Just kidding :)');
    let title = $('<h2>').type('Good night everyone!');

    el.empty().append(name).append(title);
  },

  itunes(el, result) {
    let track = result.action.track;
    if(!track) {
      el.empty().append($('<h1 class="fadeIn animated">').html('<i class="fa fa-stop"></i>'));
    } else {
      let name = $('<h1 class="fadeIn animated">').html(track.name);
      let title = $('<h2>').type(track.artist);

      el.empty().append(name).append(title);
    }
  },

  error(el) {
    el.html('<i class="fa fa-question placeholder animated shake"></i>');
  },

  reply(el, result) {
    var heading = $('<h1>');
    el.html(heading);
    heading.type(result.action.text);
  },

  hi(el, result) {
    actions.reply(el, result);
  },

  about(el, result) {
    actions.reply(el, result);
  }
};

export default actions;
