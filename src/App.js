
import React, { useState, useReducer } from 'react';

import Listen from './components/listen/listen';
import Playlist from './components/playlist/playlist';
import Display from './components/display/display';
import Check from './components/check/check';
import InfoList from './components/infolist/infolist';
import Volume from './components/volume/volume'

import Audd from './utils/audd';
import TwoDay from './utils/twoday';
import Spotify from './utils/spotify';
import { useDimensionsSetter } from './utils/useDimensionSetter';
import './app.css';

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
    success: false
}

function reducer(state, action) {
    return {...state, ...action.payload}
};

const setReset = obj => ({
    payload: obj,
});


function App() {
    const [ stream, setStream ] = useState()
    const [ state, dispatch ] = useReducer(reducer, INITIAL_STATE)
    const [ check, setCheck ] = useState('CHECK')
    const [ width, height ] = useDimensionsSetter()
    
    //makes the audioElement availablef
    const handleStream = (audioFeed) => {
      setStream(audioFeed);
    }
// triggers the song recognition process
    const handleRecognise = async () => {
// changes the button text
      setCheck('Checking')
      let spotifyResult

      try {
        // resets the screen removing the previous result
          dispatch(setReset({...INITIAL_STATE}))
        // gets a blob of music of the last 8-10 seconds
          const blobData = await TwoDay.callBlob()      
        // if it has not been recording for over 3s it fails
          if(!blobData) {
            setCheck('CHECK')
            dispatch(setReset({displayText: 'Oops, try again!'}))
            return
          }
        // sends the blob to audd for music recognition
          const auddResult = await Audd.callingApi(blobData) 
        // if audd returns an error
          if(auddResult.result === 'error'){
              reset()
              dispatch(setReset({displayText: 'Oops, try again!'}))
              return
          }
          // if audd returns a result but did not recognise the song
          if(!auddResult.success) { 
              reset()
              dispatch(setReset({displayText: 'Sorry didn\'t catch that'}))
              return  
          }
          // should add a functino which removes bracket content from the song title
          // Song Title (remastered version) for instance confuses spotify

          // this searches spotifys data base with the artist and song title
          const searchData = await Spotify.search(`"${auddResult.title}" ${auddResult.artist}`)
          // if spotify does not return any hits
          if(searchData.tracks.total === 0) {
              setCheck('CHECK')
              dispatch(setReset({displayText: 'Couldn\'t ping Spotify'}))
              return
          } else {
            // takes the first (nronally the best) result from spotifys result array
              spotifyResult = await Spotify.findTrackData(searchData.tracks.items[0].id)
          }
          setCheck('CHECK')
          // adds the results to the current state
          // the artist and song title are taken from audd,
          // the album year and popularity come from spotify
          dispatch(setReset({...auddResult, ...spotifyResult}))  
      } catch (error) {
        // catches any errors from the utils 
        console.log(error)
        reset()
      }
    }

  const handlePlayist = async () => {
    // gets the id from the existing 2day4life playlist or makes one
      const id = await Spotify.checkPlaylist()
      // checks the song is not in the playlist already and adds if not
      const result = await Spotify.checkPlaylistTracks(id, state.spotifyId, state.uri)
      // lets the user know that the song has been added or is already there
      dispatch(setReset({...state, ...result}))
  }

  const reset = () => {
      console.log('resetting')
      setCheck('CHECK')
      dispatch(setReset({...INITIAL_STATE}))
  }

  return (
    <div className="app-container" style={{width:`${width}px`, height:`${height}px`}}>
        <Volume 
          audioElement={stream}
          />
        <Listen 
          onLoad={handleStream}
          />
        {stream &&  
        <Check
          check={check}
          onClick={handleRecognise}
          />
        }
        <InfoList
          show={state.show}
          displayData={state}/>
        {state.success ? (
        <Playlist 
          show={state.success}
          onClick={handlePlayist}
          /> 
        ) : (
        <Display
            displayData={state.displayText}
          />
        )}
    </div>
  );
}


export default App;