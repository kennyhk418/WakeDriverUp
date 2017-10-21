var recognizing = false;
var ignore_onend;
var msg = '';
if (!('webkitSpeechRecognition' in window)) {
  //upgrade();
} else {
    var recognition = new webkitSpeechRecognition();
    //When user stop talking, recognition will end
    recognition.continuous = false;
    recognition.interimResults = true;
    // final_span.innerHTML = '';
    // interim_span.innerHTML = '';
    // start_img.src = 'mic-slash.gif';
    // showInfo('info_allow');
    // showButtons('none');
    // start_timestamp = event.timeStamp;
    recognition.onstart = function() {
        console.log("in onstart");
        recognizing = true;
    }
    recognition.onresult = function(event) {
        console.log("in onresult");
        msg = ''
        for (var i = event.resultIndex; i < event.results.length; i++){
            if(event.results[i].isFinal){
                msg += event.result[i][0].transcript;
            }
        }
        console.log(msg);
        document.getElementById('msg').innerHTML = msg;
    }

    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
          start_img.src = 'mic.gif';
          showInfo('info_no_speech');
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          start_img.src = 'mic.gif';
          showInfo('info_no_microphone');
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          // if (event.timeStamp - start_timestamp < 100) {
          //   showInfo('info_blocked');
          // } else {
          //   showInfo('info_denied');
          // }
          ignore_onend = true;
        }
    }

    recognition.onend = function() {
        recognizing = false;
        if(ignore_onend){
            return ;
        }
        if(!msg){
            console.log("no msg");
            return;
        }
    }
}



function container(){
  // Start button
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = "en-US";
  recognition.start();
  ignore_onend = false;
}