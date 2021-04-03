import { useState, useRef, useEffect } from 'react';
import TwoDay from '../../utils/twoday';
import { useDimensionsSetter } from '../../utils/useDimensionSetter';
import './listen.css';
let twoDayUrl;

function Listen({ onAudioLoad }) {
  const [listen, setListen] = useState('LISTEN');
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);
  const btn = useRef();
  const [width] = useDimensionsSetter();

  console.log(width);

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
    if (width < 420) {
      twoDayUrl = 'https://radio2day.ip-streaming.net/radio2dayaacp';
    } else {
      twoDayUrl = 'https://radio2day.ip-streaming.net/radio2day';
    }
  }, [width]);

  const handleKeyup = (e) => {
    if (e.keyCode === 32) {
      btn.current.click();
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyup);
    return () => {
      document.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  const playAudio = (e) => {
    if (playing) {
      audio.current.src = 'about';
      TwoDay.tearDown();
    } else {
      audio.current.src = twoDayUrl;
      audio.current.volume = 0.3;
    }
    if (!playing) {
      audio.current.play();
    }
    setListen((prev) => (prev === 'LISTEN' ? 'STOP' : 'LISTEN'));
    setPlaying(() => !playing);
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
        onClick={playAudio}
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
