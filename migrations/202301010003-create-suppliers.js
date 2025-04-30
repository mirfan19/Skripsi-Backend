'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Suppliers', {
      SupplierID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SupplierName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ContactName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      Address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Suppliers');
  },
};