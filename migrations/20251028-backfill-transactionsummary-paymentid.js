'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("SET statement_timeout = 0;");

    // Count nulls
    const [[{ cnt }]] = await queryInterface.sequelize.query(
      `SELECT COUNT(*)::int AS cnt FROM "TransactionSummary" WHERE "PaymentID" IS NULL;`
    );

    if (cnt > 0) {
      // create a dummy order (if none) and a dummy payment to attach
      const [[firstOrder]] = await queryInterface.sequelize.query(
        `SELECT "OrderID" FROM "Orders" LIMIT 1;`
      );
      let orderId = firstOrder ? firstOrder.OrderID : null;

      if (!orderId) {
        const now = new Date();
        const res = await queryInterface.sequelize.query(
          `INSERT INTO "Orders" ("UserID","OrderDate","TotalAmount","Status" ${await (async ()=>{
            const cols = await queryInterface.describeTable('Orders').catch(()=>null);
            return (cols && (cols.createdAt || cols.updatedAt)) ? ',"createdAt","updatedAt"' : '';
          })()}) VALUES ($1,$2,$3,$4 ${await (async ()=>{
            const cols = await queryInterface.describeTable('Orders').catch(()=>null);
            return (cols && (cols.createdAt || cols.updatedAt)) ? ',now(),now()' : '';
          })()}) RETURNING "OrderID";`,
          { bind: [1, new Date().toISOString(), 0.00, 'Pending'] }
        );
        orderId = res[0] && res[0][0] && (res[0][0].OrderID || res[0][0].orderid) ? (res[0][0].OrderID || res[0][0].orderid) : null;
        if (!orderId) throw new Error('Failed to create dummy Order for payment backfill.');
      }

      // create dummy payment
      const [paymentRes] = await queryInterface.sequelize.query(
        `INSERT INTO "Payments" ("OrderID","PaymentMethod","Amount","Status" ${await (async ()=>{
          const cols = await queryInterface.describeTable('Payments').catch(()=>null);
          return (cols && (cols.createdAt || cols.updatedAt)) ? ',"createdAt","updatedAt"' : '';
        })()}) VALUES ($1,$2,$3,$4 ${await (async ()=>{
          const cols = await queryInterface.describeTable('Payments').catch(()=>null);
          return (cols && (cols.createdAt || cols.updatedAt)) ? ',now(),now()' : '';
        })()}) RETURNING "PaymentID";`,
        { bind: [orderId, 'System Dummy', 0.00, 'Completed'] }
      );
      const dummyPaymentId = paymentRes && paymentRes[0] && (paymentRes[0].PaymentID || paymentRes[0].paymentid) ? (paymentRes[0].PaymentID || paymentRes[0].paymentid) : null;
      if (!dummyPaymentId) throw new Error('Failed to create dummy Payment for backfill.');

      // update NULLs to dummyPaymentId
      await queryInterface.sequelize.query(
        `UPDATE "TransactionSummary" SET "PaymentID" = $1 WHERE "PaymentID" IS NULL;`,
        { bind: [dummyPaymentId] }
      );
    }

    // now safe: add FK and set NOT NULL
    // add FK (if not exists) and set NOT NULL
    await queryInterface.sequelize.query(`
      ALTER TABLE "TransactionSummary"
      ALTER COLUMN "PaymentID" SET NOT NULL;
    `).catch(err => {
      console.warn('Setting NOT NULL skipped/failed:', err.message || err);
    });

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='transactionsummary_paymentid_fkey'
        ) THEN
          ALTER TABLE "TransactionSummary"
          ADD CONSTRAINT transactionsummary_paymentid_fkey
          FOREIGN KEY ("PaymentID") REFERENCES "Payments"("PaymentID") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END
      $$;
    `);
  },

  down: async (queryInterface /* Sequelize */) => {
    await queryInterface.sequelize.query("SET statement_timeout = 0;");
    await queryInterface.sequelize.query(`
      ALTER TABLE "TransactionSummary" DROP CONSTRAINT IF EXISTS transactionsummary_paymentid_fkey;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "TransactionSummary" ALTER COLUMN "PaymentID" DROP NOT NULL;
    `);
  }
};