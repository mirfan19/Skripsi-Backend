'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get existing financial reports
    const reports = await queryInterface.sequelize.query(
      'SELECT "ReportID" from "FinancialReport";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (reports.length === 0) {
      throw new Error('No financial reports found. Please seed financial reports first.');
    }

    // Get existing payments
    const payments = await queryInterface.sequelize.query(
      'SELECT "PaymentID" from "Payments";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (payments.length === 0) {
      throw new Error('No payments found. Please seed payments first.');
    }

    return queryInterface.bulkInsert('TransactionSummary', [
      {
        ReportID: reports[0].ReportID,
        PaymentID: payments[0].PaymentID,
        TransactionDate: new Date(),
        Amount: 150000.00,
        TransactionType: 'Income'
      },
      {
        ReportID: reports[1].ReportID,
        PaymentID: payments[1].PaymentID,
        TransactionDate: new Date(),
        Amount: 250000.00,
        TransactionType: 'Expense'
      },
      {
        ReportID: reports[2].ReportID,
        PaymentID: payments[2].PaymentID,
        TransactionDate: new Date(),
        Amount: 100000.00,
        TransactionType: 'Income'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TransactionSummary', null, {});
  },
};