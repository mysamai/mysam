import $ from './plugins';
import can from 'can';
import index from './index.stache!';
import Map from 'can/map/';
import 'can/map/define/';
import Recognizer from './recognition/recognizer';
import Learning from './models/learning';

new Learning({
  test: 'me'
}).save().then(learning => {
  console.log(learning);
});

const recognition = new Recognizer();
const AppState = Map.extend({
  define: {
    recognition: {
      value: recognition
    },

    name: {
      value: 'sam'
    },

    timeout: {
      value: 5000
    },

    listening: {
      get(old, set) {
        let transcript = this.attr('recognition.transcript');
        let name = this.attr('name');
        let id = this.timeoutId;

        if(id) {
          clearTimeout(id);
        }

        id = setTimeout(() => {
          set(false);
          this.timeoutId = null;
        }, this.attr('timeout'));

        this.timeoutId = id;

        return transcript.toLowerCase().indexOf(name) !== -1;
      }
    }
  }
});


$(() => {
  let state = new AppState();

  $('body').append(index(state));
  recognition.start();
});
