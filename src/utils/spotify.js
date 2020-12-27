import FirebaseFunc from './firebaseFunc';
// accessToken for spotify user access
let accessToken;
// accessToken for spotify client access, the app can be used without the
// user loging in to their personal account
let clientToken;
// name of the playlist in spotify account
const name = '2Day4Life'
// redirect url for spotify login
//const redirectUri = 'https://radio-player-5a684.web.app/'
const redirectUri = 'http://localhost:3000';

const Spotify = {
    // sets the access token for users personal spotify login 
    async getAccessToken() {
        if (accessToken){
            // if the access token is already set returns it 
            return accessToken
        } else {
            // gets the apiToken from firebase
            const spotifyKey = await FirebaseFunc.callSpotify()
            let accessTokenMatch;
            let timeoutInMatch;
            // opens a popup with redirect to spotify login - implicit grant flow
            let popup = 
            window.open(`https://accounts.spotify.com/authorize?client_id=${spotifyKey}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`,
            'Login with Spotify',
            'width=600,height=600')  

// this would probably be alot better, attaching a callback to the window
// which is then attached to the popup - this is vue... 
//https://codepen.io/leemartin/pen/EOxxYR?editors=1010# 

// the timer needs a shutdown function if the user doesn't log in the interval
// keeps running 
// need to set an event listener which alerts on window close prob popup.onunload


            // sets a timer which checks if the access token is in the spotify url
            const timer = setInterval(() => {
                try{
            // fails initially due to cors access but eventually redirects back to 
            // our url which then allows access to the token and expiry time
                    accessTokenMatch = popup.location.href.match(/access_token=([^&]*)/)
                    timeoutInMatch = popup.location.href.match(/expires_in=([^&]*)/)
                } catch(err) {console.log(err)}
                if(accessTokenMatch && timeoutInMatch){
            // when we have access to the token 
            // closes the popup
                    popup.close()
            // clears the timer
                    clearInterval(timer)
            // sets the access token
                    accessToken = accessTokenMatch[1]
                    const expiresIn = Number(timeoutInMatch[1])
            // alerts the user that they need to press the add to playlist button again
                    alert('Logged in, now you can close the popup and add the song to Spotify')
            // sets a timeout for the access token which expires after an hour
                    window.setTimeout(() => accessToken = '', expiresIn * 1000)
                    return accessToken
                }
            }, 1000)
        }
    },
    // sets the client accessToken
    async getClientToken() {
        if(clientToken){
            return clientToken
        }
    // gets the access token from firebase functions
        const response = await FirebaseFunc.spotifyId();
    // sets the client accessToken
        clientToken = response.data.id
    // sets a timeout for when the accesstoken expires after an hour
        window.setTimeout(() => clientToken = '', response.data.expiresIn*1000)
        return clientToken
    },
    // gets the track data using the spotify track id and returns the data
    // to <App /> as an object
    async findTrackData(id) {
        const clientId = await Spotify.getClientToken();
        try {
            const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, 
                {   method: 'GET',
                    headers: {Authorization: `Bearer ${clientId}`}, 
                })
            const data = await response.json()
            const spotifyData = {
                album: data.album.name,
                image: data.album.images[1].url,
                releaseDate: data.album.release_date,
                popularity: data.popularity,
                uri: data.uri,
                spotifyId: data.id,
                show: true,
            }
            return spotifyData
        } catch(err) {console.log(err)}
    },
// searches the spotify databbase using the song title and artist
    async search(term) {
        try {
            const clientId = await Spotify.getClientToken();
            const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
                {   method: 'GET',
                    headers: {Authorization: `Bearer ${clientId}`},
                })
            const data = await response.json()
            console.log(data)
            // this returns the top 20 tracks from which the first is taken
            // the data is then accessed from spotify using the track ID with findTrackData()
            return data
        } catch(err) {console.log(err)}
    },
// sets the userId or Spotify user name
    async setUserId() {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', 
                {   method: 'GET',
                    headers: {Authorization: 'Bearer ' + accessToken}
                })
            const data = await response.json()
            return data.id
        } catch(err) {console.log(err)}
    },
// if the 2day4life playlist does not already exist it creates a new one
// and returns the spotify playlist id
    async createPlaylist(userId) {
        try {
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
                {   method: 'POST',
                    headers: {Authorization: `Bearer ${accessToken}`},
                    body: JSON.stringify({name: name, public: true})
                })
            const data = await response.json()
            return data.id
        } catch(err) {console.log(err)}
    },
    // checks to see if the playlist already exists
    async checkPlaylist() {
    // checks the accessToken is still current
        if(!accessToken) {
            // this could be better - you should not need to press the button twice
            // would need to return a promise from getAccessToken 
            Spotify.getAccessToken()
        }
        let playlistId
        try {
    // gets a list of the user playlists 
            const response = await fetch('https://api.spotify.com/v1/me/playlists',
                {   method: 'GET',
                    headers: {Authorization: 'Bearer ' + accessToken}
                })
            const data = await response.json()
            const playlistArray = await data.items.map(item => ({
                name: item.name,
                id: item.id
            }))
    // loops over the playlists to see if one with the name alreaddy exists
            for (let i=0; i<playlistArray.length;i++) {
                if(playlistArray[i].name === name) {
                    playlistId = playlistArray[i].id
                }
            }
    // if it does not exists it creates a playlist 
            if(!playlistId) {
                const userId = await Spotify.setUserId()
                const id = await Spotify.createPlaylist(userId)
                playlistId = id;
            }
    // else it returns the playlist id 
            return playlistId
        } catch (err) {console.log(err)}
    },
// adds the song to the 2day4life playlist
    async addToPlaylist(playlistId, trackUri) {
        if(!(playlistId && trackUri)) {
            return
        }
        try {
            const id = await Spotify.setUserId()
            const response = await fetch(`https://api.spotify.com/v1/users/${id}/playlists/${playlistId}/tracks`,
                {   method: 'POST', 
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        },
                    body: JSON.stringify({uris: [trackUri]}),
                })
            const data = await response.json()
            return data
        } catch(err) {console.log(err)}
    },
// checks the tracks in the 2day4life to make sure the track has not 
// already been added - note only checks the first 100 tracks in the playlist
    async checkPlaylistTracks(id, trackId, trackUri) {
        if(!(id && trackId && trackUri)) {
            return
        }
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`,
                {   headers: {Authorization: `Bearer ${accessToken}`}
                })
            const data = await response.json()
            const trackArray = await data.items.map(item => ({
                id: item.track.id
            }))
            for (let i=0; i<trackArray.length;i++) {
                if(trackArray[i].id === trackId) {
                    return {displayText: 'Song already in the playlist', success: false}
                }
            }
            await Spotify.addToPlaylist(id, trackUri)
            return {displayText: 'Song added to Spotify', success: false}
        } catch(err) {console.log(err)}
    },
};
export default Spotify;
