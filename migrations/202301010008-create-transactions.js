'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      TransactionID: {
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
      PaymentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Payments',
          key: 'PaymentID',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      TransactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      Amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop foreign key constraint ke Payments jika ada
    try {
      await queryInterface.removeConstraint('Transactions', 'Transactions_PaymentID_fkey');
    } catch (e) {
      // Constraint mungkin sudah tidak ada, abaikan error
    }
    await queryInterface.dropTable('Transactions');
  },
};