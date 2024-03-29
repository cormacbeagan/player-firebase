import React, { useState, useReducer, useEffect, Suspense } from 'react';
import Listen from './components/listen/listen';
import Check from './components/check/check';
import InfoList from './components/infolist/infolist';
import Volume from './components/volume/volume';

import Audd from './utils/audd';
import TwoDay from './utils/twoday';
import Spotify from './utils/spotify';
import { useDimensionsSetter } from './utils/useDimensionSetter';
import './app.css';
import Station from './components/station/station';
const Playlist = React.lazy(() => import('./components/playlist/playlist'));
const Display = React.lazy(() => import('./components/display/display'));

const radioStations = {
  twoDay: {
    name: '2Day',
    url: 'https://radio2day.ip-streaming.net/radio2day',
    signal: 'FM 89.0',
  },
  schwarz: {
    name: 'SWR',
    url: 'https://stream.schwarzwaldradio.com/schwarzwaldradio',
    signal: 'FM 87.5',
  },
};

const INITIAL_STATE = {
  artist: '',
  title: '',
  album: '',
  image: '',
  show: false,
  releaseDate: '',
  popularity: '',
  uri: '',
  spotifyId: false,
  displayText: '',
  success: false,
};

function reducer(state, action) {
  return { ...state, ...action.payload };
}

const setReset = (obj) => ({
  payload: obj,
});

function App() {
  const [stream, setStream] = useState();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [check, setCheck] = useState('CHECK');
  const [width, height] = useDimensionsSetter();
  const [station, setStation] = useState(radioStations.twoDay);

  useEffect(() => {
    Spotify.getClientToken();
  }, []);

  const handleStation = (value) => {
    setStation(radioStations[value]);
  };

  const handleStream = (audioFeed) => {
    setStream(audioFeed);
  };
  const handleRecognise = async () => {
    setCheck('Checking');
    let spotifyResult;

    try {
      dispatch(setReset({ ...INITIAL_STATE }));
      const blobData = await TwoDay.callBlob();
      if (!blobData) {
        setCheck('CHECK');
        dispatch(setReset({ displayText: 'Oops, try again!' }));
        return;
      }
      const auddResult = await Audd.callingApi(blobData);

      if (auddResult.result === 'error') {
        reset();
        dispatch(setReset({ displayText: 'Oops, try again!' }));
        return;
      }
      if (!auddResult.success) {
        reset();
        dispatch(setReset({ displayText: "Sorry didn't catch that" }));
        return;
      }

      const title = auddResult.title.replace(/ *\([^)]*\) */g, '');
      const artist = auddResult.artist.replace(/ *\([^)]*\) */g, '');
      const searchData = await Spotify.search(`${title} ${artist}`);
      if (searchData.tracks.total === 0) {
        setCheck('CHECK');
        dispatch(setReset({ displayText: "Couldn't ping Spotify" }));
        return;
      } else {
        spotifyResult = await Spotify.findTrackData(
          searchData.tracks.items[0].id
        );
      }
      setCheck('CHECK');
      dispatch(setReset({ ...auddResult, ...spotifyResult }));
    } catch (error) {
      console.log(error);
      reset();
    }
  };

  const handlePlayist = async () => {
    const id = await Spotify.checkPlaylist();
    const result = await Spotify.checkPlaylistTracks(
      id,
      state.spotifyId,
      state.uri
    );
    dispatch(setReset({ ...state, ...result }));
  };

  const reset = () => {
    setCheck('CHECK');
    dispatch(setReset({ ...INITIAL_STATE }));
  };

  return (
    <main
      className="app-container"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <h1 className="heading">Radio Player</h1>
      <Volume audioElement={stream} />
      <Listen onAudioLoad={handleStream} station={station} />
      {stream && <Check check={check} onClick={handleRecognise} />}
      <InfoList show={state.show} displayData={state} station={station} />
      <Suspense fallback={<div>Loading...</div>}>
        {state.success ? (
          <Playlist show={state.success} onClick={handlePlayist} />
        ) : (
          <Display displayData={state.displayText} />
        )}
      </Suspense>
      <Station
        handleStation={handleStation}
        station={station}
        stations={radioStations}
      />
    </main>
  );
}

export default App;
