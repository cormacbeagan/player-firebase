const functions = require('firebase-functions');
const axios = require('axios')

// https://textav.gitbook.io/firebase-react-notes/react-+-firebase/firebase-react-context/motivation
// should set up firebase in context...

// still need to set the region for the functions, probably best if they are all
// in europe as mostly just client-firebase calls

exports.auddKey = functions.https.onCall((data, context) => {    
        return {id: functions.config().audd.key}
    });

exports.spotifyId = functions.https.onCall((data, contextt) => {
    const config = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {Authorization: 'Basic ' + (new Buffer.from(`${functions.config().spotify.key}:${functions.config().spotify.id}`).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        data: 'grant_type=client_credentials',
    }
    return axios(config).then(res => {
        return {id: res.data.access_token, expiresIn: res.data.expires_in}
    })
    .catch(err => {
            return err
    })

});

exports.spotifyKey = functions.https.onCall((data, context) => {    
    return {id: functions.config().spotify.key}
});


// possibly interesting https://blog.pragmatists.com/server-side-code-with-firebase-functions-44b8dd269aa5