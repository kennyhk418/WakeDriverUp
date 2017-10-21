var recognizing = false;
var ignore_onend;
var msg = '';
var start_time;
function permission(){
  navigator.getUserMedia (
     // constraints
     {
        // video: true,
        audio: true
     },

     // successCallback
     function(localMediaStream) {
       console.log("gain permission");
        // var video = document.querySelector('video');
        // video.src = window.URL.createObjectURL(localMediaStream);
        // video.onloadedmetadata = function(e) {
           // Do something with the video here.
        // };
     },

     // errorCallback
     function(err) {
      if(err === PERMISSION_DENIED) {
        // Explain why you need permission and how to update the permission setting
      }
     }
  );
}
if (!('webkitSpeechRecognition' in window)) {
  console.log("need webkitSpeechRecognition");
  //upgrade();
}
else {
  console.log("has webkitSpeechRecognition");
  permission();
  var recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
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
    start_time = (new Date()).getTime();
    recognizing = true;
    var x = setInterval(function(){
      // recognition.stop();
      recognition.stop();
      console.log("end onstart");
      clearInterval(x);
    },5000);

  }
  recognition.onresult = function(event) {
      console.log("in onresult");
      msg = ''
      if((new Date).getTime() - start_time > 5000){
        console.log("expire");
        return;
      }
      for (var i = event.resultIndex; i < event.results.length; i++){
          if(event.results[i].isFinal){
              msg += event.results[i][0].transcript;
          }
      }
      console.log("msg = " + msg);
      if(msg != ''){
        document.getElementById('msg').innerHTML = msg;
        if(msg.toUpperCase() == "PLUS"){
          console.log("+");
        }
        else if(msg.toUpperCase() == "MINUS"){
          console.log("-");
        }
      }
  }

  recognition.onerror = function(event) {
    console.log("in onerror");
    if (event.error == 'no-speech') {
      console.log("no-speech");
      start_img.src = 'mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      console.log("audio-capture");
      start_img.src = 'mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      console.log("not-allowed");
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
  recognition.start();
}

function getMsg(){
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