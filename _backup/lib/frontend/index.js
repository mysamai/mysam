var $ = require('jquery');


var recognition = new SpeechRecognition();
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

$.fn.type = function(txt, speed = 100) {
  let txtLen = txt.length;
  let char = 0;

  const type = () => {
    var humanize = Math.round(Math.random() * (speed - 20)) + 30;
    var timeOut = setTimeout(() => {
      this.text(txt.substring(0, ++char));
      type();

      if (char === txtLen) {
        clearTimeout(timeOut);
      }
    }, humanize);
  };

  type();
};


$(() => {
  $('h1').type('Hey what is up?');
});