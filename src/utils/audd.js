import FirebaseFunc from './firebaseFunc';

const Audd = {
    async callingApi(audioBlob) {
        try {
            const auddId = await FirebaseFunc.callAudd();
            const audioForm = new FormData();
            audioForm.append('api_token', auddId.data.id)
            audioForm.append('file', audioBlob)
            const response = await fetch('https://api.audd.io',
                    {   method:'POST',
                        body: audioForm,
                        redirect: 'follow',
                        mode: 'cors',
                    })
            const data = await response.json()
            console.log(data)
            if(data.result !== null && data.status !== 'error') {
                const resultObject = {
                    artist: data.result.artist,
                    title: data.result.title,     
                    success: true,
                }
                return resultObject
            } else {
                return {success: false, result: data.status}
            }
        } catch(err) {console.log(err)}
    },
};

export default Audd;
