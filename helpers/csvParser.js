const csv = require('fast-csv')
const fs = require('fs')
const path = require('path')
const { sequelize } = require('../models')
const queryInterface = sequelize.getQueryInterface()

module.exports = function addFoodsData(folder, fileName, authorId) {
    let dataArr = []
    fs.createReadStream(path.resolve(__dirname, '..', folder, fileName))
        .pipe(csv.parse({headers: true}))
        .on('data', (row) => {
            dataArr.push(row)
        })
        .on('end', () => {
            dataArr.forEach(d => {
                d.createdAt = new Date()
                d.updatedAt = new Date()
                d.authorId = authorId
            })
            return queryInterface.bulkInsert('Food', dataArr, {})
        })
}
