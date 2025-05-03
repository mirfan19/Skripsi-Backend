'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('TransactionSummary', {
      SummaryID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PaymentID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Payments',
          key: 'PaymentID',
        },
      },
      ReportID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'FinancialReport',
          key: 'ReportID',
        },
      },
      TransactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      Amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      TransactionType: {
        type: Sequelize.ENUM('Income', 'Expense'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('TransactionSummary');
  }
};
