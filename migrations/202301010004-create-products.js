'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      ProductID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ProductName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      Price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      StockQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      SupplierID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Suppliers',
          key: 'SupplierID',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('Products');
  },
};