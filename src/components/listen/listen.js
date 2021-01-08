import React, { useState, useRef, useEffect } from 'react';
import TwoDay from '../../utils/twoday';
import './listen.css';

function Listen({onLoad}) {
  const [ listen, setListen ] = useState('LISTEN')
  const [ playing, setPlaying ] = useState(false)
  const audio = useRef()
  

  
  useEffect(() => {
      const audioSet = audio.current;
      const loader = () => {
        onLoad(audio.current);
        TwoDay.creatingBlob(audio.current)
      }
      audioSet.addEventListener('playing', loader)
      return () => {
        audioSet.removeEventListener('playing', loader)
      }
  }, [])

  const playAudio = (e) => {
    e.preventDefault()
    
    if(playing) {
      audio.current.src = 'about'
      TwoDay.tearDown()
    } else {
      audio.current.src = 'https://radio2day.ip-streaming.net/radio2day'
      audio.current.volume = 0.3;
    }
    setListen((prev) => (prev === 'LISTEN' ? 'STOP' : 'LISTEN'))
    setPlaying(() => (playing ? false : true))
    if(!playing) {
      audio.current.play()
    }
    }
  return (
    <div className='divListenStyle' >
        <audio className='audioStyle' ref={audio} src='' type='audio/webm' crossOrigin="anonymous" />
          <a id="listen" className='listen-btn listen-btn-white'
          onClick={playAudio} 
          style={listen === 'STOP' ? {backgroundColor: '#0e4aa531'} : {backgroundColor: '#f744447e'}}
          >
          {listen}
        </a>
    </div>
  );
};

export default Listen;