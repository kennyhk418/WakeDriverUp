var recognizing = false;
var ignore_onend;
var msg = '';
var start_time;
var freq = 10;

/* function name: askPermission */
function askPermission(){
  navigator.getUserMedia (
     // constraints
     {audio: true},

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

function change_freq(){
  s = document.getElementById("freq");
  freq = s.options[s.selectedIndex].value;
  console.log(freq);
  clearInterval(loop_question);
  loop_question = setInterval(function(){
    var question = ask_question();
    var correct = speech_recognition(question);
  }, freq * 60 * 1000);
}

var loop_question = setInterval(function(){
  var question = ask_question();
  var correct = speech_recognition(question);
}, freq * 60 * 1000);

/* funciton name: speech_recognition
   get the response from the user
*/
function speech_recognition(question){

  /* the browser doesn't have speech recognition */
  if (!('webkitSpeechRecognition' in window)) {
    console.log("need webkitSpeechRecognition");
    //upgrade();
  }

  /* user has the speech recognition */
  else {
    console.log("has webkitSpeechRecognition");

    /* ask for audio permission first */
    askPermission();

    var recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";

    //When user stop talking, recognition will end
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = function() {
      msg = ''
      console.log("in onstart");
      start_time = (new Date()).getTime();
      recognizing = true;

      /* if within 6s after speech_recognition start,
       * and no sound has been get, the recognition will be terminated
       */
      var x = setInterval(function(){
        recognition.stop();
        console.log("end onstart");
        clearInterval(x);
        if (msg == ''){
          var audio = new Audio("Lion_Growling.mp3");
          audio.play();
        }
      },6000);
    }

    recognition.onresult = function(event) {
      console.log("in onresult");
      /* if some sound is get, but already timeout, ignore the result */
      if((new Date).getTime() - start_time > 5000){
        console.log("expire");
        return msg;
      }

      /* try to reconize the words one by one and store into a string */
      for (var i = event.resultIndex; i < event.results.length; i++){
        if(event.results[i].isFinal){
          msg += event.results[i][0].transcript;
        }
      }
      console.log("msg = " + msg);

      /* some sound is get but not recongized, don't check with the answer */
      if(msg != ''){
        document.getElementById('msg').innerHTML = msg;
        correct = check_answer(question);

        if(correct){
          //correct sound
        }
        else{
          //incorrect sound
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

/* function name: ask_question
   generate two digits, speak, and return the addition of two digits
*/
function ask_question(){
  var first = Math.floor(Math.random() * 10);
  var second = Math.floor(Math.random() * 10);
  var result = first + second;

  /* string to be spoken */
  var string_question = first + "+" + second;
  var speech = new SpeechSynthesisUtterance();

  speech.text = string_question;

  console.log(speech);

  /* speak to the user */
  window.speechSynthesis.speak(speech);

  /* return the addition of two digits */
  return result;
}