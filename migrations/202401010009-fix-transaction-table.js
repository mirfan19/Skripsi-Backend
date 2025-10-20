'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query("SET statement_timeout = 0;");

      const columns = await queryInterface.describeTable('Transactions').catch(() => null);
      if (!columns) return;

      if (!columns.TransactionID) {
        await queryInterface.addColumn('Transactions', 'TransactionID', {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true
        });
      }
    } catch (err) {
      console.error('Migration 202401010009 up failed:', err);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // disable timeout for safety
      await queryInterface.sequelize.query("SET LOCAL statement_timeout = 0;", { transaction });

      // find foreign key constraints that reference Transactions(TransactionID)
      const [refs] = await queryInterface.sequelize.query(
        `
        SELECT
          kcu.constraint_name,
          kcu.table_name
        FROM information_schema.referential_constraints rc
        JOIN information_schema.key_column_usage kcu
          ON rc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON rc.unique_constraint_name = ccu.constraint_name
        WHERE ccu.table_name = 'Transactions'
          AND ccu.column_name = 'TransactionID';
        `,
        { transaction }
      );

      // remove each foreign key constraint on referencing tables
      for (const r of refs) {
        const tbl = r.table_name;
        const constraint = r.constraint_name;
        try {
          // double-check constraint exists before removing
          const [[{ cnt }]] = await queryInterface.sequelize.query(
            `
            SELECT COUNT(*)::int AS cnt
            FROM information_schema.table_constraints
            WHERE constraint_name = :constraint
              AND table_name = :table
              AND constraint_type = 'FOREIGN KEY'
            `,
            { replacements: { constraint, table: tbl }, transaction }
          );

          if (cnt > 0) {
            await queryInterface.removeConstraint(tbl, constraint, { transaction });
          }
        } catch (err) {
          // log and continue
          // eslint-disable-next-line no-console
          console.warn(`Warning removing constraint ${constraint} on ${tbl}:`, err.message || err);
        }
      }

      // now safe to remove the column (if exists)
      const columns = await queryInterface.describeTable('Transactions').catch(() => null);
      if (columns && columns.TransactionID) {
        await queryInterface.removeColumn('Transactions', 'TransactionID', { transaction });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.error('Migration 202401010009 down failed:', err);
      throw err;
    }
  }
};
