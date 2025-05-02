'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('TransactionSummary', [
      {
        ReportID: 1, // Replace with an existing ReportID from FinancialReport
        PaymentID: 1, // Replace with an existing PaymentID
        TransactionDate: new Date(),
        Amount: 150000.00,
        TransactionType: 'Income', // Use 'Income' or 'Expense'
      },
      {
        ReportID: 2, // Replace with an existing ReportID from FinancialReport
        PaymentID: 2, // Replace with an existing PaymentID
        TransactionDate: new Date(),
        Amount: 250000.00,
        TransactionType: 'Expense', // Use 'Income' or 'Expense'
      },
      {
        ReportID: 3, // Replace with an existing ReportID from FinancialReport
        PaymentID: 3, // Replace with an existing PaymentID
        TransactionDate: new Date(),
        Amount: 100000.00,
        TransactionType: 'Income', // Use 'Income' or 'Expense'
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TransactionSummary', null, {});
  },
};