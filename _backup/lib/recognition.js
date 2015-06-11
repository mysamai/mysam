var socket = io();

socket.emit('classifiers::create', { name: 'default' });
socket.emit('classifiers::patch', 'default', {
  text: 'Sam are you there',
  label: 'ping'
});
socket.emit('classifiers::patch', 'default', {
  text: 'Sam can you hear me',
  label: 'ping'
});
socket.emit('classifiers::patch', 'default', {
  text: 'Sam',
  label: 'listen'
});
socket.emit('classifiers::patch', 'default', {
  text: 'Hey Sam',
  label: 'listen'
});
socket.emit('classifiers::patch', 'default', {
  text: 'What\'s the weather like',
  label: 'weather'
});

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onresult = function(event) {
  if (event.results.length > 0) {
    var result = event.results[event.results.length-1];
    if(result.isFinal) {
      console.log(result[0].transcript);
      socket.emit('classification::create', {
        name: 'default',
        text: result[0].transcript
      }, function(error, classifications) {
        console.log(JSON.stringify(classifications, null, '  '));
      });
    }
  }
};
recognition.onend = function() {
  recognition.start();
};

recognition.start();