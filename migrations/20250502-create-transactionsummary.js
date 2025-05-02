'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TransactionSummary', {
      SummaryID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ReportID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'FinancialReport', // Reference the FinancialReport table
          key: 'ReportID',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      TransactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      Amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TransactionSummary');
  },
};