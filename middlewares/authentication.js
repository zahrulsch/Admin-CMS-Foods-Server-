const { User, Food } = require('../models')
const { verifyToken } = require('../helpers/jwt')

async function isAuthenticate(req, res, next) {
    try {
        const { access_token } = req.headers
        const payload = verifyToken(access_token)
        const findUser = await User.findOne({
            where: {
                email: payload.email
            }
        })
        if (!findUser) {
            throw {
                name: 'unauthorized',
                message: 'unauthorized: you can\'t access'
            }
        }
        req.user = {
            email: findUser.email,
            role: findUser.role,
            id: findUser.id,
            username: findUser.username
        }
        next()
    } catch(err) {
        next(err)
    }
}

async function isAuthorize(req, res, next) {
    try {
        const { role, id: idUser } = req.user
        const idFood = req.params.id
        if (role !== 'admin') {
            const findFood = await Food.findOne({
                where: {
                    id: idFood
                }
            })
            if (findFood.authorId == idUser) {
                next()
            } else {
                throw {
                    name: 'forbidden',
                    message: 'you cannot access this data'
                }
            }
        } else {
            next()
        }
    } catch(err) {
        next(err)
    }
}

async function isAdmin(req, res, next) {
    try {
        const userRole = req.user.role
        if(userRole.toLowerCase() !== 'admin') {
            throw {
                name: 'forbidden',
                message: 'you cannot access this data'
            }
        }
        next()
    } catch(err) {
        next(err)
    }
}

module.exports = {
    isAuthenticate,
    isAuthorize,
    isAdmin
}