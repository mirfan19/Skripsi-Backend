'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FinancialReport', {
      ReportID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      income: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      expenses: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      gross_revenue: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      net_revenue: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FinancialReport');
  },
};