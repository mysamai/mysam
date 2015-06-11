var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onresult = function(event) {
  if (event.results.length > 0) {
    var result = event.results[event.results.length-1];
    if(result.isFinal) {
      console.log(result[0].transcript);
      //socket.emit('classification::create', {
      //  name: 'default',
      //  text: result[0].transcript
      //}, function(error, classifications) {
      //  console.log(JSON.stringify(classifications, null, '  '));
      //});
    }
  }
};
recognition.onend = function() {
  recognition.start();
};

recognition.start();