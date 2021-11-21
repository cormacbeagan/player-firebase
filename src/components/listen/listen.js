import { useState, useRef, useEffect } from 'react';
import TwoDay from '../../utils/twoday';
import './listen.css';

function Listen({ onAudioLoad, station }) {
  const [listen, setListen] = useState('LISTEN');
  const [playing, setPlaying] = useState(false);
  const [stationUrl, setStationUrl] = useState(station.url);
  const audio = useRef(null);
  const btn = useRef();

  useEffect(() => {
    const audioSet = audio.current;
    const loader = () => {
      onAudioLoad(audioSet);
      TwoDay.creatingBlob(audio.current);
    };
    audioSet.addEventListener('playing', loader);
    return () => {
      audioSet.removeEventListener('playing', loader);
    };
  }, []);

  useEffect(() => {
    setStationUrl(station.url);
    stopAudio();
    if (playing) {
      playAudio(station.url);
    }
  }, [station]);

  const handleKeyup = (e) => {
    if (e.keyCode === 80) {
      btn.current.click();
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyup);
    return () => {
      document.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  useEffect(() => {
    playing ? playAudio() : stopAudio();
  }, [playing]);

  const stopAudio = () => {
    audio.current.src = 'about';
    TwoDay.tearDown();
    setListen('LISTEN');
  };

  const playAudio = (station) => {
    audio.current.src = station ? station : stationUrl;
    audio.current.volume = 0.3;
    audio.current.play();
    setListen('STOP');
  };

  return (
    <div className="divListenStyle">
      <audio
        className="audioStyle"
        ref={audio}
        src="about"
        type="audio/webm"
        crossOrigin="anonymous"
        id="audio"
      />
      <button
        tabIndex="0"
        ref={btn}
        id="listen"
        className="listen-btn"
        onClick={() => setPlaying(!playing)}
        style={
          listen === 'STOP'
            ? { backgroundColor: '#0e4aa531' }
            : { backgroundColor: '#f744447e' }
        }
      >
        {listen}
      </button>
    </div>
  );
}

export default Listen;
