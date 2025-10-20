'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // disable statement timeout for this session to avoid statement timeout on large tables
    await queryInterface.sequelize.query("SET statement_timeout = 0;");

    // safe describe
    const tableInfo = await queryInterface.describeTable('Payments').catch(() => null);
    if (!tableInfo) return;

    // add columns (no transaction to avoid long locks)
    if (!tableInfo.PaymentToken) {
      await queryInterface.addColumn('Payments', 'PaymentToken', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo.MidtransOrderID) {
      await queryInterface.addColumn('Payments', 'MidtransOrderID', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // create indexes concurrently (must not run inside transaction)
    // use raw queries with IF NOT EXISTS
    try {
      await queryInterface.sequelize.query(
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS payments_payment_token_idx ON "Payments" ("PaymentToken");`
      );
    } catch (err) {
      // index creation may fail if another process is creating index; log and continue
      // eslint-disable-next-line no-console
      console.warn('payments_payment_token_idx creation skipped/failed:', err.message || err);
    }

    try {
      await queryInterface.sequelize.query(
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS payments_midtrans_order_id_idx ON "Payments" ("MidtransOrderID");`
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('payments_midtrans_order_id_idx creation skipped/failed:', err.message || err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // disable statement timeout
    await queryInterface.sequelize.query("SET statement_timeout = 0;");

    // drop indexes concurrently (must not be in transaction)
    try {
      await queryInterface.sequelize.query(
        `DROP INDEX CONCURRENTLY IF EXISTS payments_payment_token_idx;`
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('dropping payments_payment_token_idx skipped/failed:', err.message || err);
    }

    try {
      await queryInterface.sequelize.query(
        `DROP INDEX CONCURRENTLY IF EXISTS payments_midtrans_order_id_idx;`
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('dropping payments_midtrans_order_id_idx skipped/failed:', err.message || err);
    }

    // remove columns if exist (outside transaction to avoid long locks)
    const tableInfo = await queryInterface.describeTable('Payments').catch(() => null);
    if (!tableInfo) return;

    if (tableInfo.PaymentToken) {
      try {
        await queryInterface.removeColumn('Payments', 'PaymentToken');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('removeColumn PaymentToken skipped/failed:', err.message || err);
      }
    }

    if (tableInfo.MidtransOrderID) {
      try {
        await queryInterface.removeColumn('Payments', 'MidtransOrderID');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('removeColumn MidtransOrderID skipped/failed:', err.message || err);
      }
    }
  }
};