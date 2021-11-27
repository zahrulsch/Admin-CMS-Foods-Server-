'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Food', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'active'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Food', 'status', {})
  }
};
