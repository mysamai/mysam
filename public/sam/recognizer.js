import Map from 'can/map/';
import 'can/map/define/';

// recognition.continuous = true;
// recognition.interimResults = true;

export default Map.extend({
  define: {
    transcript: {
      value: ''
    },

    restart: {
      value: true
    }
  },

  init() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.onresult = this.result.bind(this);
  },

  result(event) {
      if (event.results.length > 0) {
        let result = event.results[event.results.length-1];
        if(result.isFinal) {
          this.attr('confidence', result[0].confidence);
          this.attr('transcript', result[0].transcript);
          console.log(result[0].transcript);
        }
      }
  },

  start() {
    this.attr('restart', true);
    this.recognition.start();
    this.recognition.onend = this.onEnd.bind(this);
  },

  stop() {
    this.attr('restart', false);
    this.recognition.stop();
  },

  onEnd() {
    if(this.attr('restart')) {
      this.recognition.start();
    }
  }
});
