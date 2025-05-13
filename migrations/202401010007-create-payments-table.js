'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      PaymentID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TransactionID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Transactions',
          key: 'TransactionID'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
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
        allowNull: false
      },
      Amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
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

    // Add indexes for better performance
    await queryInterface.addIndex('Payments', ['OrderID']);
    await queryInterface.addIndex('Payments', ['TransactionID']);
    await queryInterface.addIndex('Payments', ['Status']);
    await queryInterface.addIndex('Payments', ['PaymentDate']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('Payments', ['OrderID']);
    await queryInterface.removeIndex('Payments', ['TransactionID']);
    await queryInterface.removeIndex('Payments', ['Status']);
    await queryInterface.removeIndex('Payments', ['PaymentDate']);

    // Then drop the table
    await queryInterface.dropTable('Payments');
  }
};