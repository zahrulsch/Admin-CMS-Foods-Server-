require('dotenv').config()
const cors = require('cors')
const express = require('express')
const errorHandlers = require('./middlewares/errorHandler')
const app = express()
const router = require('./routes/index')

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(router)
app.use(errorHandlers)

// app.listen(port, () => {
//     console.log(`App running on 'http://localhost:${port}`)
// })

module.exports = app