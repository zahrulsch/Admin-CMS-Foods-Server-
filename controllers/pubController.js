const { User, Food, Category, Bookmark } = require('../models')
const { verifyPassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')
const { Op } = require('sequelize')

class Controller {
    static async register( req, res, next) {
        try {
            const { email, password, username, phone, address } = req.body
            const role = 'customer'
            const response = await User.create({
                email, password, username, phone, address, role
            })

            const resp = {
                id: response.id,
                email: response.email
            }

            res.status(201).json(resp)
        } catch(err) {
            next(err)
        }
    }

    static async login( req, res, next ) {
        try {
            const { email, password } = req.body
            const response = await User.findOne({
                where: {
                    email
                }
            })
            if(!response) {
                throw {
                    name: 'unauthorized',
                    message: 'invalid email/password'
                }
            }
            const comparedPassword = verifyPassword(password, response.password)
            if(!comparedPassword) {
                throw {
                    name: 'unauthorized',
                    message: 'you cannot access'
                }
            }
            const accessToken = generateToken({
                id: response.id,
                email: response.email
            })
            res.status(200).json({access_token: accessToken})
        } catch(err) {
            next(err)
        }
    }

    static async getFoods( req, res, next ) {
        try {
            const {
                categoryId,
                minPrice,
                maxPrice,
                page,
                name
            } = req.query

            let where = {
                status: 'active'
            }
            let pages = Number(page) ? Number(page) - 1: 0
            let limit = 10

            if(name) {
                where.name = {
                    [Op.iLike] : `%${name}%`
                }
            }

            if(minPrice) {
                where.price = {
                    [Op.gte] : Number(minPrice)
                }
            }

            if(maxPrice) {
                where.price = {
                    [Op.lte] : Number(maxPrice)
                }
            }

            if(minPrice && maxPrice) {
                where.price = {
                    [Op.between] : [Number(minPrice), Number(maxPrice)]
                }
            }

            if(categoryId) {
                where.categoryId = categoryId
            }

            const response = await Food.findAndCountAll({
                limit: limit,
                offset: Number(pages) * limit,
                include: [Category],
                where: where,
                order: [['createdAt', 'DESC']]
            })
            res.status(200).json({status: 'success', data: response})
        } catch(err) {
            next(err)
        }
    }

    static async getFoodById( req, res, next ) {
        try {
            const { id } = req.params
            const response = await Food.findByPk(id)
            if (!response) {
                throw {
                    name: 'dataNotFound',
                    message: `data with id ${id} is not found`
                }
            }
            res.status(200).json({status: 'success', data: response})
        } catch(err) {
            next(err)
        }
    }

    static async getCategories(req, res, next) {
        try {
            const response = await Category.findAll({
                attributes: ['id', 'name']
            })
            res.status(200).json({status: 'success', data: response})
        } catch(err) {
            next(err)
        }
    }

    static async getBookmark(req, res, next) {
        try {
            const { id } = req.public
            const response = await Bookmark.findAll({
                where: {
                    userId: id
                },
                attributes: ['userId', 'foodId', 'id']
            })
            res.status(200).json({status: 'success', data: response})
        } catch(err) {
            next(err)
        }
    }

    static async setBookmark(req, res, next) {
        try {
            const foodId = Number(req.params.id)
            const foods = await Food.findByPk(foodId)
            if (!foods) {
                throw {
                    name: 'dataNotFound',
                    message: `food with id ${foodId} is not exist`
                }
            }

            const response = await Bookmark.findAll({
                where: {
                    userId: req.public.id
                }
            })
            const userBookmarks = response.map(e => e.foodId)
            if (userBookmarks.includes(foodId)) {
                throw {
                    name: 'alreadyBookmarked',
                    message: `food with id ${foodId} is already bookmarked`
                }
            }
            const createBookmark = await Bookmark.create({
                foodId: foodId,
                userId: req.public.id
            })
            res.status(201).json({status: 'success', message: `success add food with id ${foodId} to my bookmarks`})
        } catch(err) {
            next(err)
        }
    }

    static async getBookmarkDetail(req, res, next) {
        try {
            const userId = req.public.id
            const response = await Bookmark.findAll({
                where: {
                    userId: userId
                },
                include: [Food]
            })
            const bookmarks = response.map(e => e.Food)
            res.status(200).json({status: 'success', data: bookmarks})
        } catch(err) {
            next(err)
        }
    }
}

module.exports = Controller