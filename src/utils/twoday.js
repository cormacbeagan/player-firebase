const TwoDay = {
  chunks: [],
  timer: {},
  ctx: {},
  source: {},
  recordingOne: {},
  recordingTwo: {},
  counter: 0,
  captureStreamTest: false,
  stream: {},
  creatingBlob(audio) {
    console.log('creating');
    let firstChunks = [];
    let secondChunks = [];
    let timeSlice = 1000;

    try {
      audio.captureStream();
      this.captureStreamTest = true;
    } catch (err) {}
    if (!this.captureStreamTest) {
      try {
        audio.mozCaptureStream();
        this.captureStreamTest = 'moz';
      } catch (err) {
        console.log(err);
      }
    }
    if (this.captureStreamTest === true) {
      this.stream = audio.captureStream();
    } else if (this.captureStreamTest === 'moz') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.source = this.ctx.createMediaElementSource(audio);
      this.stream = audio.mozCaptureStream();
      this.source.connect(this.ctx.destination);
    } else {
      alert('Audio capture not supported in this browser');
      return;
    }
    this.recordingOne = new MediaRecorder(this.stream);
    this.recordingOne.ondataavailable = function (event) {
      firstChunks.push(event.data);
    };
    this.recordingOne.onstop = function () {
      firstChunks = [];
    };
    this.recordingTwo = new MediaRecorder(this.stream);
    this.recordingTwo.ondataavailable = function (event) {
      secondChunks.push(event.data);
    };
    this.recordingTwo.onstop = function () {
      secondChunks = [];
    };
    const recordingTimer = () => {
      if (this.counter === 0) {
        this.recordingOne.start(timeSlice);
        this.recordingTwo.start(timeSlice);
        this.chunks = firstChunks;
      }
      if (this.counter === 5) {
        this.chunks = firstChunks;
        if (this.recordingTwo.state === 'recording') this.recordingTwo.stop();
        this.recordingTwo.start(timeSlice);
      }
      if (this.counter === 14) {
        this.chunks = secondChunks;
        if (this.recordingOne.state === 'recording') this.recordingOne.stop();
        this.recordingOne.start(timeSlice);
      }
      if (this.counter === 22) {
        console.log('running');
        this.counter = 4;
      }
      this.counter++;
    };
    this.timer = setInterval(recordingTimer, 1000);
  },

  tearDown() {
    this.chunks = [];
    this.counter = 0;
    clearInterval(this.timer);
    if (this.recordingOne?.state === 'recording') {
      this.recordingOne.stop();
    }
    if (this.recordingTwo?.state === 'recording') {
      this.recordingTwo.stop();
    }
    if (this.captureStreamTest === 'moz') {
      this.source.disconnect(this.ctx.destination);
      this.ctx.close();
      this.source = null;
    }
    console.log('tear down');
  },

  callBlob() {
    if (this.chunks.length <= 2) {
      return false;
    }
    const audioBlob = new Blob(this.chunks, { type: 'audio/webm' });
    return audioBlob;
  },
};

export default TwoDay;
