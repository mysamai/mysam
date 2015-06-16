import Map from 'can/map/';
import 'can/map/define/';

import Recognizer from './recognizer';
const recognition = new Recognizer();

export default Map.extend({
  define: {
    recognition: {
      value: recognition
    },

    threshold: {
      value: 0.1
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

        if (id) {
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
  },

  pastThreshold: function(classifications) {
    const threshold = this.attr('threshold');

    for(let i = 0; i < classifications.length; i++) {
      if(classifications[i].value > threshold) {
        return true;
      }
    }

    return false;
  }
});
