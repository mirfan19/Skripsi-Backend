'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderItems', {
      OrderItemID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrderID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'OrderID',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      ProductID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'ProductID',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      Quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop foreign key constraint ke Products jika ada
    try {
      await queryInterface.removeConstraint('OrderItems', 'OrderItems_ProductID_fkey');
    } catch (e) {
      // Constraint mungkin sudah tidak ada, abaikan error
    }
    await queryInterface.dropTable('OrderItems');
  },
};