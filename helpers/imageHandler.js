const axios = require('axios')
const FormData = require('form-data')
const privateKey = process.env.PRIVATE_KEY

async function imageUploader(imageBase64, fileName) {
    try {
        const authorization = Buffer.from(privateKey + ':').toString('base64')
        let fd = new FormData()
        fd.append('file', imageBase64)
        fd.append('fileName', fileName)
        const uploader = await axios({
            method: 'post',
            url: process.env.URL_ENDPOINT,
            headers: {
                ...fd.getHeaders(),
                'Authorization': 'Basic ' + authorization
            },
            data: fd
        })
        return {imageUrl: uploader.data.url}
    } catch(err) {
        return {imageUrl: null}
    }
}

module.exports = imageUploader