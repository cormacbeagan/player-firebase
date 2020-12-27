let chunks = [];
let timer;
let ctx;
let source;
let recordingOne;
let recordingTwo;
let counter = 0;
let captureStreamTest = false;
let stream;



const TwoDay = {
  // recieves the audio element
  creatingBlob(audio) {
      let firstChunks = [];
      let secondChunks = [];
      let timeSlice = 1000;
  
  // checks to see if the browser is chrome
      try {
        audio.captureStream()
        captureStreamTest = true
      } catch(err) {}
  // checks if the browser is Mozilla
      if(!captureStreamTest) {
        try {
          audio.mozCaptureStream()
          captureStreamTest = 'moz'
        } catch(err) {console.log(err)}
      }
  // if chrome creates a stream from the audio element
      if(captureStreamTest === true) {
        stream = audio.captureStream()

      } else if (captureStreamTest === 'moz') {
  // if mozilla creates an audio Context, creates a stream from the audio element
  // then connects the audio from the context to the speakers
  // the music will not play whilst captureStream is running otherwise
        const AudioContext = window.AudioContext || window.webkitAudioContext
        ctx = new AudioContext()
        source = ctx.createMediaElementSource(audio)
        stream = audio.mozCaptureStream()
        source.connect(ctx.destination);

      } else {
        // this should fire in Safari browsers
        alert('Audio capture not supported in this browser')
        return
      }
  // defines the first recorder 
      recordingOne = new MediaRecorder(stream)
      recordingOne.ondataavailable = function(event) {
        firstChunks.push(event.data);  
        }
      recordingOne.onstop = function() {
  // clears the data from the chunks array on stop
        firstChunks = [];
      }
  // defines the second recorder 
      recordingTwo = new MediaRecorder(stream)
      recordingTwo.ondataavailable = function(event) {
        secondChunks.push(event.data);  
        }
      recordingTwo.onstop = function() {
  // clears the data from the chunks array on stop
        secondChunks = [];
      }
  // controls the offest of the recorders stoping and starting appropriately
      const recordingTimer = () => {
          if(counter === 0) {
  // starts both timers
            recordingOne.start(timeSlice)  
            recordingTwo.start(timeSlice)
  // callBlob will now take the first recording
            chunks = firstChunks
          }
  // after the first run the loop returns to this point
          if(counter === 5) {
  // call blob will now access the first recording
            chunks = firstChunks
   // stop and or start the second recorder
            if(recordingTwo.state === 'recording') recordingTwo.stop()
            recordingTwo.start(timeSlice)
          }
          if(counter === 14) {
    // callBlob will now access the second recording 
            chunks = secondChunks
    // stop and restart the firs recording 
            if(recordingOne.state === 'recording') recordingOne.stop()
            recordingOne.start(timeSlice)
          }
          if(counter === 22){
    // return to 5 in the loop
            counter = 4;
          }
          counter++;
      }
    // starts the timer
      timer = setInterval(recordingTimer, 1000)
  },
  
  // this fires when the music is stopped
  tearDown() {
    chunks = []
    counter = 0
  // clears the timer
    clearInterval(timer)
  // stops the recordings 
    if(recordingOne.state === 'recording') {
      recordingOne.stop()
    }
    if(recordingTwo.state === 'recording') {
      recordingTwo.stop()
    }
    // disconnects and closes the AudioContext
    if(captureStreamTest === 'moz') {
      source.disconnect(ctx.destination)
      ctx.close()
      source = null
    }
  },
// creates and returns a blob of recorded music to <App/>
  callBlob() {
    // returns if the blob is too short
      if(chunks.length <= 2) {
        return false
      }
      // creates the blob from which ever chunks array is selected in the timer
      const audioBlob = new Blob(chunks, {'type': 'audio/webm'})  
      return audioBlob
  }
};

export default TwoDay;
