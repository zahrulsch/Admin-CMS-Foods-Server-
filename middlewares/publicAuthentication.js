const { verifyToken } = require('../helpers/jwt')
const { User } = require('../models')

module.exports = async function publicAuthentication (req, res, next) {
  try {
    const { access_token } = req.headers
    const payload = verifyToken(access_token)
    const response = await User.findOne({
      where: {
        email: payload.email
      }
    })
    if (!response) {
        throw {
            name: 'unauthorized',
            message: 'unauthorized: you can\'t access'
        }
    }
    req.public = {
      id: response.id,
      email: response.email,
      role: response.role
    }
    next()
  } catch(err) {
    next(err)
  }
}