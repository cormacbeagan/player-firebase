import FirebaseFunc from './firebaseFunc';

const Audd = {
    // send the blob to audd.io music recognition
    // and returns the result
    async callingApi(audioBlob) {
        try {
            // get the access token
            const auddId = await FirebaseFunc.callAudd();
            // create a formdata to send to audd
            const audioForm = new FormData();
            // add the api token
            audioForm.append('api_token', auddId.data.id)
            // add the music blob
            audioForm.append('file', audioBlob)
            // note that it is possible to request spotify, applemusic 
            // and musicBrainz data from audd aswell but that the spotify data is 
            // more error prone than just searching spotify with the title 
            // and artist


            // send to audd.io
            const response = await fetch('https://api.audd.io',
                    {   method:'POST',
                        body: audioForm,
                        redirect: 'follow',
                        mode: 'cors',
                    })
            const data = await response.json()
            console.log(data)
            // if there is a hit from audd returns an object with the data
            // to <App /> 
            if(data.result !== null && data.status !== 'error') {
                const resultObject = {
                    artist: data.result.artist,
                    title: data.result.title,     
                    success: true,
                }
                return resultObject
            } else {
                // if there is no hit form Audd return this object
                return {success: false, result: data.status}
            }
        } catch(err) {console.log(err)}
    },
};

export default Audd;
