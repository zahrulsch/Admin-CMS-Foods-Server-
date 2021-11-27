function errorHandlers(err, req, res, next) {
    // console.log(err)
    switch(err.name) {
        case 'SequelizeForeignKeyConstraintError':
            res.status(400).json({status: 'error', message: [err.parent.detail]})
            break
        case 'SequelizeUniqueConstraintError':
            res.status(400).json({status: 'error', message: 'email has been used'})
            break;
        case 'alreadyBookmarked':
            res.status(400).json({status: 'error', message: err.message})
        case 'SequelizeValidationError':
            const message = err.errors.map(e => e.message)
            res.status(400).json({status: 'error', message})
            break
        case 'dataNotFound':
            res.status(404).json({status: 'error', message: [err.message]})
            break
        case 'unauthorized':
            res.status(401).json({status: 'error', message: [err.message]})
            break
        case 'forbidden':
            res.status(403).json({status: 'error', message: [err.message]})
            break
        case 'JsonWebTokenError':
            res.status(401).json({status: 'error', message: ['unauthorized: you can\'t access']})
            break
        case 'emptyFields':
            res.status(400).json({status: 'error', message: [err.message]})
            break
        case 'tooLargeImageSize':
            res.status(400).json({status: 'error', message: [err.message]})
            break
        case 'fileEmpty':
        case 'fileTypeNotAllowed':
            res.status(400).json({status: 'error', message: [err.message]})
            break
        default:
            res.status(500).json({status: 'error', message: [err]})
            break
    }
}

module.exports = errorHandlers