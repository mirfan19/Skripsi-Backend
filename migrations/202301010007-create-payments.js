'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      PaymentID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrderID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'OrderID'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      PaymentMethod: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      Status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Pending'
      },
      PaymentToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      MidtransOrderID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      PaymentDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Payments');
  },
};