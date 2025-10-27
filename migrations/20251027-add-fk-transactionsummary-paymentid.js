'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("SET statement_timeout = 0;");

    // detect if table exists
    const tbl = await queryInterface.describeTable('TransactionSummary').catch(() => null);
    if (!tbl) return;

    // add FK only if not exists
    const [rows] = await queryInterface.sequelize.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name='TransactionSummary' AND constraint_type='FOREIGN KEY'
        AND constraint_name='transactionsummary_paymentid_fkey';
    `);
    if (!rows || rows.length === 0) {
      await queryInterface.sequelize.query(`
        ALTER TABLE "TransactionSummary"
        ADD CONSTRAINT transactionsummary_paymentid_fkey
        FOREIGN KEY ("PaymentID") REFERENCES "Payments"("PaymentID")
        ON DELETE SET NULL ON UPDATE CASCADE;
      `);
    }
  },

  down: async (queryInterface /* Sequelize */) => {
    await queryInterface.sequelize.query("SET statement_timeout = 0;");
    await queryInterface.sequelize.query(`
      ALTER TABLE "TransactionSummary" DROP CONSTRAINT IF EXISTS transactionsummary_paymentid_fkey;
    `);
  }
};