'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'Category', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Lainnya',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'Category');
  },
};
