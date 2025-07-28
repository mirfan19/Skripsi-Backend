"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("MonthlyReport", {
      MonthlyIncomeID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Month: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      TotalIncome: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      ReportId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("MonthlyReport");
  },
};
