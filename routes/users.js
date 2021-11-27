const UserController = require('../controllers/userController')
const express = require('express')
const router = express.Router()
const { isAuthenticate } = require('../middlewares/authentication')

router.post('/login-google', UserController.loginGoogle)
router.get('/users', isAuthenticate, UserController.users)
router.get('/user', isAuthenticate, UserController.user)
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/', async(req, res, next) => {
    res.send('Hacktiv CMS App')
})

module.exports = router