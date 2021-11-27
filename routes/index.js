const express = require('express')
const foodsRouter = require('./foods')
const usersRouter = require('./users')
const pubRouter = require('./pub')
const router = express.Router()

router.use('/', usersRouter)
router.use('/foods', foodsRouter)
router.use('/pub', pubRouter)
module.exports = router