'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("SET statement_timeout = 0;");

    // ensure table exists
    const tbl = await queryInterface.describeTable('TransactionSummary').catch(() => null);
    if (!tbl) return;

    // delete rows with null PaymentID (BACKUP DB before doing this)
    await queryInterface.sequelize.query(`DELETE FROM "TransactionSummary" WHERE "PaymentID" IS NULL;`);

    // ensure there are no nulls before setting NOT NULL
    await queryInterface.sequelize.query(`ALTER TABLE "TransactionSummary" ALTER COLUMN "PaymentID" SET NOT NULL;`);

    // add FK constraint if not exists
    await queryInterface.sequelize.query(`
      ALTER TABLE "TransactionSummary"
      ADD CONSTRAINT transactionsummary_paymentid_fkey
      FOREIGN KEY ("PaymentID") REFERENCES "Payments"("PaymentID")
      ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  down: async (queryInterface /* Sequelize */) => {
    await queryInterface.sequelize.query("SET statement_timeout = 0;");
    await queryInterface.sequelize.query(`
      ALTER TABLE "TransactionSummary" DROP CONSTRAINT IF EXISTS transactionsummary_paymentid_fkey;
    `);
    // allow null again
    await queryInterface.sequelize.query(`ALTER TABLE "TransactionSummary" ALTER COLUMN "PaymentID" DROP NOT NULL;`);
  }
};