import React, { useEffect } from 'react';
import './station.css';

export default function Station({ handleStation, station, stations }) {
  const handleKeyup = (e) => {
    if (e.keyCode === 50) {
      handleSwitch(undefined, 'twoDay');
    }
    if (e.keyCode === 87) {
      handleSwitch(undefined, 'schwarz');
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyup);
    return () => {
      document.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  const handleSwitch = (e, value) => {
    const data = value ? value : station.name === '2Day' ? 'schwarz' : 'twoDay';
    handleStation(data);
  };
  return (
    <div className="switch-container">
      <p className="station-name">{stations['schwarz'].name}</p>
      <label className="switch" aria-label="dark mode button">
        <input
          type="checkbox"
          onChange={handleSwitch}
          checked={station.name === '2Day'}
        />
        <span className="slider round"></span>
      </label>
      <p className="station-name right">{stations['twoDay'].name}</p>
    </div>
  );
}
