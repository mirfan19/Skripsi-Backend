'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FinancialReports', {
      ReportID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Income: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      Expenses: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      GrossRevenue: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      NetRevenue: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FinancialReports');
  },
};