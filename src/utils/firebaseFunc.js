import firebase from 'firebase/app';
import 'firebase/functions';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
};
firebase.initializeApp(firebaseConfig);

const FirebaseFunc = {
    callAudd() {
        const auddKey = firebase.functions().httpsCallable('auddKey');
        return auddKey().then(data => {
            return data
        })
    },
    async spotifyId() {
        try {
            const spotifyId = firebase.functions().httpsCallable('spotifyId');
            const spotifyToken = await spotifyId();
            return spotifyToken 
        } catch(err) {console.log(err)}    
    },
    callSpotify() {
        const spotifyKey = firebase.functions().httpsCallable('spotifyKey');
        return spotifyKey().then(data => {
            return data.data.id
        })
    },
}

export default FirebaseFunc;