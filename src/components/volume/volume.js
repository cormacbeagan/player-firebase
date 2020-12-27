import React, { useEffect, useState } from 'react';
import './volume.css'

function Volume({audioElement}){
    const [ loudness, setLoudness ] = useState(0.3)
    useEffect(() => {
        if(audioElement){
            audioElement.volume = loudness
        }
    }, [audioElement])

    const handleChange = (e) => {
        setLoudness(e.target.value)
        if(audioElement) {
            audioElement.volume = e.target.value
        }

    }

    return (
        <div className='volume-container'>
            <input 
                type="range" 
                className="volume-slider" 
                min="0" max="1" 
                step="0.05" 
                value={loudness}
                onChange={handleChange}
                onMouseMove={handleChange}
            />
        </div>
    )
};

export default Volume;