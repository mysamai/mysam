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
      value: 30000
    },

    listening: {
      set(value) {
        if(value) {
          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
          }, this.attr('timeout'));
        } else {
          this.timeoutId = null;
        }
      },

      get(old, set) {
        let transcript = this.attr('recognition.transcript');
        let name = this.attr('name');
        let id = this.timeoutId;
        let isListening = !!id ;
        let startListening = transcript.toLowerCase().indexOf(name) !== -1;

        if (id) {
          clearTimeout(id);
          this.timeoutId = null;
        }

        if(startListening || isListening) {
          this.timeoutId = setTimeout(() => {
            set(false);
            this.timeoutId = null;
          }, this.attr('timeout'));
        }

        return isListening || startListening;
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
