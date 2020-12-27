import firebase from 'firebase/app';
import 'firebase/functions';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
};
// initialise firebase
firebase.initializeApp(firebaseConfig);

const FirebaseFunc = {
    // returns the audd apitoken 
    // note audd should be moved entirely to server side but sending the 
    // blob to firebase functions was problematic
    callAudd() {
        const auddKey = firebase.functions().httpsCallable('auddKey');
        return auddKey().then(data => {
            return data
        })
    },
    // gets a access token valid for an hour using the spotify secret ID
    // this is all server side and ok
    async spotifyId() {
        try {
            const spotifyId = firebase.functions().httpsCallable('spotifyId');
            const spotifyToken = await spotifyId();
            return spotifyToken 
        } catch(err) {console.log(err)}    
    },
    // returns the spotify access token
    callSpotify() {
        const spotifyKey = firebase.functions().httpsCallable('spotifyKey');
        return spotifyKey().then(data => {
            return data.data.id
        })
    },
}

export default FirebaseFunc;