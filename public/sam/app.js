import $ from './utils';
import can from 'can';
import 'simpleweather';

import index from './index.stache!';
import actions from './actions';
import Classify from './models/classify';
import AppState from './state';

$(() => {
  let state = new AppState();

  state.bind('recognition.transcript', function (ev, value) {
    if(state.attr('listening')) {
      new Classify({
        input: value
      }).save().then(function (result) {
          let action = actions[result.action.action];

          if(!state.pastThreshold(result.classifications)) {
            action = actions.error;
          } else {
            state.attr('error', false);
          }

          if (action) {
            action($('#main'), result, state);
          }
        }, function () {
          console.log(arguments);
        });
    }
  });

  $('body').append(index(state)).on('submit', 'form', function (ev) {
    ev.preventDefault();
  });

  state.attr('recognition').start();
});
