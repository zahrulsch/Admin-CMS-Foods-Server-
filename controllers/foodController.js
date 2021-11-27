const { Food, Category, User, FoodHistory } = require('../models')
const imageUploader = require('../helpers/imageHandler')
const verfivyImage = require('../helpers/imageSizeVerifier')

class FoodController {
    static async get( req, res, next ) {
        try {
            const allFoods = await Food.findAll({
                include: [Category]
            })
            res.status(200).json({status: 'success', data: allFoods})
        } catch(err) {
            next(err)
        }
    }

    static async post( req, res, next ) {
        try {
            const { name, description, price, categoryId } = req.body
            if(req.file) {
                // ! Multer handler
                await verfivyImage(req.file, 255000, ['image/jpeg', 'image/png'])
            }
            let imageBase64 = req.file ? req.file.buffer.toString('base64') : null
            let imgUrl = ''
            
            if (imageBase64) {
                const uploader = await imageUploader(imageBase64, req.file.originalname)
                if(!uploader.imageUrl) {
                    throw {
                        status: 'error',
                        message: 'error during upload image to server'
                    }
                }
                imgUrl = uploader.imageUrl
            }

            const authorId = req.user.id
            const create = await Food.create({
                name, description, price, imgUrl, authorId, categoryId
            })

            if(create) {
                const foodId = create.id
                const title = create.name
                const descriptionUpdate = `Food with id ${foodId} created`
                const updateBy = req.user.email

                await FoodHistory.create({
                    foodId: foodId,
                    title: title,
                    description: descriptionUpdate,
                    updatedBy: updateBy
                })

                res.status(201).json({status: 'success', data: create})
            }

        } catch(err) {
            next(err)
        }
    }

    static async getFoodById( req, res, next ) {
        try {
            const id = req.params.id
            const data = await Food.findByPk(id, {
                include: [
                    {
                        model: Category,
                        attributes: ['name']
                    },
                    {
                        model: User,
                        attributes: ['username']
                    }
                ]
            })
            if (!data) {
                throw {
                    name: 'dataNotFound',
                    message: `data with id ${id} is not found`
                }
            }
            res.status(200).json({status: 'success', data: data})
        } catch(err) {
            next(err)
        }
    }

    static async updateFoodById( req, res, next ) {
        try {
            const id = req.params.id
            const { name, description, price, categoryId } = req.body

            if(req.file) {
                // ! Multer handler
                await verfivyImage(req.file, 255000, ['image/jpeg', 'image/png'])
            }
            let imageBase64 = req.file ? req.file.buffer.toString('base64') : null
            let imgUrl
            
            if (imageBase64) {
                const uploader = await imageUploader(imageBase64, req.file.originalname)
                if(!uploader.imageUrl) {
                    throw {
                        status: 'error',
                        message: 'error during upload image to server'
                    }
                }
                imgUrl = uploader.imageUrl
            }

            const update =  await Food.update({
                name, description, price, imgUrl, categoryId
            }, {
                where: {
                    id: id
                },
                returning: true
            })
            if (!update[0]) {
                throw {
                    name: 'dataNotFound',
                    message: `data with id ${id} is not found`
                }
            }

            await FoodHistory.create({
                foodId: update[1][0].id,
                title: update[1][0].name,
                description: `Food with id ${update[1][0].id} updated`,
                updatedBy: req.user.email
            })

            res.status(200).json({status: 'success', data: update[1][0]})
        } catch(err) {
            next(err)
        }
    }

    static async deleteFoodById( req, res, next ) {
        try {
            const id = req.params.id
            const del = await Food.destroy({
                where: {
                    id
                }
            })
            if (!del) {
                throw {
                    name: 'dataNotFound',
                    message: `data with id ${id} is not found`
                }
            }
            res.status(200).json({status: 'success', data: `data with id ${id} success to delete`})
        } catch(err) {
            next(err)
        }
    }

    static async getAllCategories(req, res, next) {
        try {
            const categories = await Category.findAll({
                attributes: ['id', 'name']
            })
            res.status(200).json({status: 'success', data: categories})
        } catch(err) {
            next(err)
        }
    }

    static async updateStatusById(req, res, next) {
        try {
            const newStatus = req.body.newStatus
            const foodId = req.params.id

            const findFood = await Food.findByPk(foodId)
            if(!findFood) {
                throw {
                    name: 'dataNotFound',
                    message: `data with id ${foodId} is not found`
                }
            }

            const previousStatus = findFood.status
            const updateStatus = await Food.update({
                status: newStatus
            }, {
                where: {
                    id: foodId
                },
                returning: true
            })
            
            if(updateStatus[0]) {
                await FoodHistory.create({
                    foodId: foodId,
                    title: findFood.name,
                    description: `food with ${foodId} status has been updated from ${previousStatus} into ${updateStatus[1][0].status}`,
                    updatedBy: req.user.email
                })

                res.status(200).json({status: 'success', data: 'updateStatus'})
            }
        } catch(err) {
            next(err)
        }
    }

    static async getAllHistories(req, res, next) {
        try {
            const histories = await FoodHistory.findAll({
                order: [['createdAt', 'DESC']]
            })

            res.status(200).json({status: 'success', data: histories})
        } catch(err) {
            next(err)
        }
    }
}

module.exports = FoodController