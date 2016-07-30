import memory from 'feathers-memory';

const SpeechRecognition = window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition ||
  window.oSpeechRecognition;

class Recognizer extends memory.Service {
  current() {
    return this.get('current').catch(() => this.create({
      id: 'current',
      listening: false,
      text: ''
    }));
  }

  toggle() {
    this.get('current').then(current =>
      current.listening ? this.stop() : this.start()
    );
  }

  start() {
    return this.patch('current', { listening: true })
      .then(() => new Promise((resolve, reject) => {
        this.recognition.start();      
        this.once('transcript', text => {
          this.stop();
          resolve({ text });
        });

        this.once('error', event => reject(new Error(event.message)));
      })).then(data => this.patch('current', data));
  }

  stop() {
    this.recognition.stop();
    return this.get('current');
  }

  setup() {
    this.recognition = new SpeechRecognition();
    this.recognition.onresult = event => this.emit('result', event);
    this.recognition.onend = () => this.emit('end');
    this.recognition.onerror = event => this.emit('error', event);

    this.on('result', event => {
      if(event.results.length > 0) {
        let transcripts = event.results[event.results.length-1];

        if(transcripts.isFinal) {
          this.emit('transcript', transcripts[0].transcript);
        }
      }
    });
    this.on('end', () => this.patch('current', { listening: false }));
  }
}

export default Recognizer;
