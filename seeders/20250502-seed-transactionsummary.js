'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ensure target table exists and whether it requires timestamps
    const tableInfo = await queryInterface.describeTable('TransactionSummary').catch(() => null);
    if (!tableInfo) {
      console.warn('TransactionSummary table not found — skipping seeder.');
      return;
    }
    const needsTimestamps = !!(tableInfo.createdAt || tableInfo.updatedAt);

    // fetch reports and payments
    const reports = await queryInterface.sequelize.query(
      'SELECT "ReportID" FROM "FinancialReport" ORDER BY "ReportID" ASC;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const payments = await queryInterface.sequelize.query(
      'SELECT "PaymentID" FROM "Payments" ORDER BY "PaymentID" ASC;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!reports.length || !payments.length) {
      throw new Error('Missing dependencies: seed FinancialReport and Payments first.');
    }

    // determine how many rows we can build
    const count = Math.min(reports.length, payments.length, 3);
    const now = new Date();
    const amountSamples = [150000.00, 250000.00, 100000.00];
    const typeSamples = ['Income', 'Expense', 'Income'];

    const rows = [];
    for (let i = 0; i < count; i++) {
      if (reports[i] && payments[i] && payments[i].PaymentID != null) {
        const r = {
          ReportID: reports[i].ReportID,
          PaymentID: payments[i].PaymentID,
          TransactionDate: now,
          Amount: amountSamples[i % amountSamples.length],
          TransactionType: typeSamples[i % typeSamples.length],
        };
        if (needsTimestamps) {
          r.createdAt = now;
          r.updatedAt = now;
        }
        rows.push(r);
      }
    }

    if (rows.length > 0) {
      return queryInterface.bulkInsert('TransactionSummary', rows, {});
    } else {
      console.warn('No TransactionSummary rows inserted: not enough valid payments or reports.');
      return;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    // remove seeded rows by matching sample amounts and types (safe)
    return queryInterface.bulkDelete(
      'TransactionSummary',
      {
        Amount: { [Op.in]: [150000.00, 250000.00, 100000.00] },
        TransactionType: { [Op.in]: ['Income', 'Expense'] }
      },
      {}
    );
  }
};