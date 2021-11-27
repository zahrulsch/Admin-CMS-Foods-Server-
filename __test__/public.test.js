const app = require('../app')
const request = require('supertest')
const { User, sequelize } = require('../models')
const addFoodsData = require('../helpers/csvParser')
const queryInterface = sequelize.getQueryInterface()

async function emptyTableData() {
    await queryInterface.bulkDelete('Food', null, {})
    await queryInterface.bulkDelete('Users', null, {})
}

async function addFoods() {
    const lastUser = await User.findAll({
        limit: 1,
        order: [ [ 'createdAt', 'DESC' ]]
    })

    const lastId = lastUser[0].id
    addFoodsData('data', 'foods.csv', lastId)
}



describe('POST /pub/register', () => {
    beforeAll(() => {
        return emptyTableData()
    }, 5000)
    
    it('Sending correct email password', (done) => {
        const data = {
            email: 'user1@mail.com',
            password: 'password',
            username: 'user name',
            phone: '082237329000',
            address: 'JAKARTA',
            role: 'admin'
        }

        request(app)
            .post('/pub/register')
            .send(data)
            .then(resp => {
                expect(resp.body.id).toEqual(expect.any(Number))
                expect(resp.body.email).toEqual(expect.any(String))
                done()
            })
    })

    it('Sending with no email', (done) => {
        const data = {
            password: 'password',
            username: 'user name',
            phone: '082237329000',
            address: 'JAKARTA',
            role: 'admin'
        }

        request(app)
            .post('/pub/register')
            .send(data)
            .then(resp => {
                expect(resp.body.status).toBe('error')
                expect(resp.body.message).toEqual(expect.any(Array))
                expect(resp.body.message[0]).toEqual(expect.stringContaining('cannot be null'))
                done()
            })
    })

    it('Sending with no password', (done) => {
        const data = {
            email: 'user1@mail.com',
            username: 'user name',
            phone: '082237329000',
            address: 'JAKARTA',
            role: 'admin'
        }

        request(app)
            .post('/pub/register')
            .send(data)
            .then(resp => {
                expect(resp.body.status).toBe('error')
                expect(resp.body.message).toEqual(expect.any(Array))
                expect(resp.body.message[0]).toEqual(expect.stringContaining('cannot be null'))
                done()
            })
    })

    it('Sending email with empty string', (done) => {
        const data = {
            email: '',
            password: 'password',
            username: 'user name',
            phone: '082237329000',
            address: 'JAKARTA',
            role: 'admin'
        }

        request(app)
            .post('/pub/register')
            .send(data)
            .then(resp => {
                expect(resp.body.status).toBe('error')
                expect(resp.body.message).toEqual(expect.any(Array))
                expect(resp.body.message[0]).toEqual(expect.stringContaining('cannot be empty'))
                done()
            })
    })

    it('Sending password with empty string', (done) => {
        const data = {
            email: 'user1@mail.com',
            password: '',
            username: 'user name',
            phone: '082237329000',
            address: 'JAKARTA',
            role: 'admin'
        }

        request(app)
            .post('/pub/register')
            .send(data)
            .then(resp => {
                expect(resp.body.status).toBe('error')
                expect(resp.body.message).toEqual(expect.any(Array))
                expect(resp.body.message[0]).toEqual(expect.stringContaining('cannot be empty'))
                done()
            })
    })
    
    it('Sending with same email', (done) => {
        const data = {
            email: 'user1@mail.com',
            password: 'password',
            username: 'user name',
            phone: '082237329000',
            address: 'JAKARTA',
            role: 'admin'
        }

        request(app)
            .post('/pub/register')
            .send(data)
            .then(resp => {
                expect(resp.body.status).toBe('error')
                expect(resp.body.message).toEqual(expect.any(String))
                expect(resp.body.message).toEqual(expect.stringContaining('used'))
                done()
            })
    })

    it('Sending with invalid email', (done) => {
        const data = {
            email: 'user1mail.com',
            password: 'password',
            username: 'user name',
            phone: '082237329000',
            address: 'JAKARTA',
            role: 'admin'
        }

        request(app)
            .post('/pub/register')
            .send(data)
            .then(resp => {
                expect(resp.body.status).toBe('error')
                expect(resp.body.message).toEqual(expect.any(Array))
                expect(resp.body.message[0]).toEqual(expect.stringContaining('invalid'))
                done()
            })
    })
})

describe('POST /pub/login', () => {

    it('Sending correct data login', (done) => {
        const data = {
            email: 'user1@mail.com',
            password: 'password'
        }

        request(app)
            .post('/pub/login')
            .send(data)
            .then((resp) => {
                expect(resp.body.access_token).toEqual(expect.any(String))
                expect(resp.statusCode).toBe(200)
                done()
            })
    })

    it('Sending wrong password to login', (done) => {
        const data = {
            email: 'user1@mail.com',
            password: 'password1'
        }

        request(app)
            .post('/pub/login')
            .send(data)
            .then((resp) => {
                expect(resp.body.status).toBe('error')
                expect(resp.body.message[0]).toEqual(expect.stringContaining('cannot access'))
                expect(resp.statusCode).toBe(401)
                done()
            })
    })

    it('Sending wrong email to login', (done) => {
        const data = {
            email: 'user2@mail.com',
            password: 'password'
        }

        request(app)
            .post('/pub/login')
            .send(data)
            .then((resp) => {
                expect(resp.body.status).toBe('error')
                expect(resp.body.message[0]).toEqual(expect.stringContaining('invalid'))
                expect(resp.statusCode).toBe(401)
                done()
            })
    })
})

describe('GET /pub/foods', () => {
    beforeAll(() => {
        return addFoods()
    })

    it('get public foods data', (done) => {
        request(app)
            .get('/pub/foods')
            .then(resp => {
                expect(resp.statusCode).toBe(200)
                expect(resp.body.status).toBe('success')
                expect(resp.body.data).toEqual(expect.any(Array))
                done()
            })
    })

    // it('get public foods data with 1 parameter filter', (done) => {
    //     request(app)
    //         .get('/pub/foods?categoryId=2')
    //         .then(resp => {
    //             expect(resp.statusCode).toBe(200)
    //             expect(resp.body.status).toBe('success')
    //             expect(resp.body.data).toEqual(expect.any(Array))
    //             expect(resp.body.data.length).toEqual(6)
    //             done()
    //         })
    // })

    // it('get public foods data with 2 parameter filter', (done) => {
    //     request(app)
    //         .get('/pub/foods?categoryId=2&status=active')
    //         .then(resp => {
    //             console.log(resp.body, 'INI response body')
    //             expect(resp.statusCode).toBe(200)
    //             expect(resp.body.status).toBe('success')
    //             expect(resp.body.data).toEqual(expect.any(Array))
    //             expect(resp.body.data.length).toEqual(4)
    //             done()
    //         })
    // })
})

