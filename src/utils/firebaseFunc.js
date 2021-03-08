import firebase from '../config/fbConfig';

const FirebaseFunc = {
  /*
    callAudd() {
        const auddKey = firebase.functions().httpsCallable('auddKey');
        return auddKey().then(data => {
            return data
        })
    },
    */
  async spotifyId() {
    try {
      const spotifyId = firebase.functions().httpsCallable('spotifyId');
      const spotifyToken = await spotifyId();
      return spotifyToken;
    } catch (err) {
      console.log(err);
    }
  },
  /*
    async callSpotify() {
        const spotifyKey = firebase.functions().httpsCallable('spotifyKey');
        return spotifyKey().then(data => {
            return data.data.id
        })
    },
    */
};

export default FirebaseFunc;
