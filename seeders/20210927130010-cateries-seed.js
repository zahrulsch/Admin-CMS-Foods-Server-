'use strict';
const fs = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let file = JSON.parse(fs.readFileSync('./data/Categories.json', 'utf-8'))
    file.forEach(each => {
      each.createdAt = new Date()
      each.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Categories', file, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
