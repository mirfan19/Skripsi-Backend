npx sequelize-cli db:migrate"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed FinancialReports
    await queryInterface.bulkInsert("FinancialReports", [
      {
        MonthlyIncomeID: 1,
        Month: 7,
        Year: 2025,
        TotalIncome: 10000000,
        ReportId: null,
        date: "2025-07-01",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        MonthlyIncomeID: 2,
        Month: 6,
        Year: 2025,
        TotalIncome: 8000000,
        ReportId: null,
        date: "2025-06-01",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Seed TransactionSummaries
    await queryInterface.bulkInsert("TransactionSummaries", [
      {
        SummaryID: 1,
        PaymentID: 101,
        ReportID: 1,
        amount: 5000000,
        TransactionDate: new Date("2025-07-10"),
        TransactionType: "Income",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        SummaryID: 2,
        PaymentID: 102,
        ReportID: 1,
        amount: 5000000,
        TransactionDate: new Date("2025-07-20"),
        TransactionType: "Income",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        SummaryID: 3,
        PaymentID: 103,
        ReportID: 2,
        amount: 8000000,
        TransactionDate: new Date("2025-06-15"),
        TransactionType: "Income",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        SummaryID: 4,
        PaymentID: 104,
        ReportID: 1,
        amount: 2000000,
        TransactionDate: new Date("2025-07-25"),
        TransactionType: "Expense",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("TransactionSummaries", null, {});
    await queryInterface.bulkDelete("FinancialReports", null, {});
  },
};
