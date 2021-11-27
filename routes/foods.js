const FoodController = require('../controllers/foodController')
const express = require('express')
const { isAdmin, isAuthenticate, isAuthorize } = require('../middlewares/authentication')
const router = express.Router()
const multer = require('multer')


const multerWare = multer({ storage: multer.memoryStorage() }).single('image')

router.use(isAuthenticate)
router.get('/', FoodController.get)
router.post('/', multerWare, FoodController.post)
router.get('/histories', FoodController.getAllHistories)
router.get('/categories', FoodController.getAllCategories)
router.get('/:id', FoodController.getFoodById)
router.patch('/:id', isAdmin, FoodController.updateStatusById)
router.put('/:id', isAuthorize, multerWare, FoodController.updateFoodById)
router.delete('/:id', isAuthorize, FoodController.deleteFoodById)

module.exports = router