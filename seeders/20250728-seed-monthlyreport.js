"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("MonthlyReport", null, {
      restartIdentity: true,
    });
    await queryInterface.bulkInsert("MonthlyReport", [
      {
        MonthlyIncomeID: 1,
        Month: 7,
        Year: 2025,
        TotalIncome: 12000000,
        ReportId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        MonthlyIncomeID: 2,
        Month: 6,
        Year: 2025,
        TotalIncome: 9000000,
        ReportId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("MonthlyReport", null, {
      restartIdentity: true,
    });
  },
};
