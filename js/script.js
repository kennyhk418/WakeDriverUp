var recognizing = false;
var ignore_onend;
var msg = '';
var start_time;
function permission(){
  navigator.getUserMedia (
     // constraints
     {
        audio: true
     },

     // successCallback
     function(localMediaStream) {
       console.log("gain permission");
     },

     // errorCallback
     function(err) {
      if(err === PERMISSION_DENIED) {
        // Explain why you need permission and how to update the permission setting
      }
     }
  );
}

var loop_question = setInterval(function(){
    var question = ask_question();
    var correct = speech_recognition(question);
  }, 5000);

// speech_recognition(temp);

function speech_recognition(question){
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

    recognition.onstart = function() {
      console.log("in onstart");
      start_time = (new Date()).getTime();
      recognizing = true;
      var x = setInterval(function(){
        // recognition.stop();
        recognition.stop();
        console.log("end onstart");
        clearInterval(x);
      },6000);
    }
    recognition.onresult = function(event) {
        console.log("in onresult");
        msg = ''
        if((new Date).getTime() - start_time > 5000){
          console.log("expire");
          return '';
        }
        for (var i = event.resultIndex; i < event.results.length; i++){
            if(event.results[i].isFinal){
                msg += event.results[i][0].transcript;
            }
        }
        console.log("msg = " + msg);
         if(msg != ''){
            document.getElementById('msg').innerHTML = msg;
            correct = check_answer(question);
            // if(correct){
            //   return true;
            // }
            // else{
            //   return false;
            // }
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
  while(!correct){

  }
  return correct;
}

function check_answer(result){
    if (msg == result){
      console.log("Correct msg " + msg);
      return true;
    }
    else{
      console.log("Incorrect msg");
      return false;
    }
}

function ask_question(){
  var first = Math.floor(Math.random() * 10);
  var second = Math.floor(Math.random() * 10);
  var result = first + second;
  var string_question = first + "+" + second;

  var speech = new SpeechSynthesisUtterance();
  speech.text = string_question;

  console.log(speech);

  window.speechSynthesis.speak(speech);
  return result;
}