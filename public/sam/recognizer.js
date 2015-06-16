import Map from 'can/map/';
import 'can/map/define/';

// recognition.continuous = true;
// recognition.interimResults = true;

export default Map.extend({
  define: {
    transcript: {
      value: ''
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
    this.recognition.start();
    this.recognition.onend = this.end.bind(this);
  },

  end() {
    this.recognition.start();
  }
});
