const Controller = require('../controllers/pubController')
const publicAuthentication = require('../middlewares/publicAuthentication')
const express = require('express')
const router = express.Router()

router.post('/register', Controller.register)
router.post('/login', Controller.login)
router.get('/foods', Controller.getFoods)
router.get('/foods/:id', Controller.getFoodById)
router.get('/categories', Controller.getCategories)
router.use(publicAuthentication)
router.get('/bookmarks', Controller.getBookmark)
router.get('/bookmarks-detail', Controller.getBookmarkDetail)
router.post('/bookmarks/:id', Controller.setBookmark)

module.exports = router