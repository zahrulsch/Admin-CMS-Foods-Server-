async function verfivyImage(imageFile, maxSize, mimeTypeArr) {
    if(!mimeTypeArr.includes(imageFile.mimetype)) {
        throw {
            name: 'fileTypeNotAllowed',
            message: 'file type is not allowed'
        }
    }

    if(imageFile.size > maxSize) {
        throw {
            name: 'tooLargeImageSize',
            message: 'your image is too large (max size 255KB)'
        }
    }
}

module.exports = verfivyImage