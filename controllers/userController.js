const { verifyPassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')
const passGenerator = require('md5')
const { User } = require('../models')
const clientKey = process.env.APP_GOOGLE_KEY
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(clientKey)

class UserController {
    static async loginGoogle(req, res, next) {
        try {
            const {tokenId} = req.body
            const translated = await client.verifyIdToken({
                idToken: tokenId,
                audience: clientKey
            })
            
            const userCreated = await User.findOrCreate({
                where: {
                    email: translated.payload.email
                },
                defaults: {
                    username: translated.payload.name,
                    password: passGenerator(translated.payload.email),
                    email: translated.payload.email,
                    address: translated.payload.locale,
                    role: 'Staff',
                    phone: 'Don\'t have a phone number'
                }
            })
            const payload = {
                id: userCreated[0].id,
                name: userCreated[0].username,
                email: userCreated[0].email
            }
            const accessToken = generateToken(payload)

            res.status(200).json({status: 'success', access_token: accessToken})
        } catch(err) {
            next(err)
        }

    }

    static async users(req, res, next) {
        try {
            const allUsers = await User.findAll({
                attributes: ['username', 'email', 'address', 'phone']
            })
            res.status(200).json({status: 'success', data: allUsers})
        } catch(err) {
            next(err)
        }
    }

    static async user(req, res, next) {
        try {
            if (!req.user) {
                throw {
                    name: 'unauthorized',
                    message: 'you cannot access this data'
                }
            }

            const dataUser = {
                username: req.user.username,
                role: req.user.role,
                id: req.user.id
            }

            res.status(200).json({status: 'success', data: dataUser})

        } catch(err) {
            next(err)
        }
    }

    static async register(req, res, next) {
        try {
            const { username, password, email, phone, address } = req.body
            const role = 'admin'

            const createUser = await User.create({
                username, password, address, email, role, phone
            })
            res.status(201).json({
                status: 'success',
                id: createUser.id,
                email: createUser.email
            })
        } catch(err) {
            next(err)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body
            const findUser = await User.findOne({
                where: {
                    email
                }
            })

            if(!email || !password) {
                throw {
                    name: 'emptyFields',
                    message: 'email / password is empty'
                }
            }

            if (!findUser) {
                throw {
                    name: 'unauthorized',
                    message: 'unauthorized: you can\'t access'
                }
            }

            if (!verifyPassword(password, findUser.password)) {
                throw {
                    name: 'unauthorized',
                    message: 'unauthorized: you can\'t access'
                }
            }
            const payload = {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email
            }
            
            const accesstoken = generateToken(payload)
            res.status(200).json({status: 'success', access_token: accesstoken})
            
        } catch(err) {
            next(err)
        }
    }
}

module.exports = UserController