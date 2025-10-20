'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // find actual table name that looks like FinancialReport(s)
    const allTables = await queryInterface.showAllTables();
    const tableList = allTables.map(t => (typeof t === 'object' ? (t.tableName || t.name || '') : String(t)));
    const found = tableList.find(
      n => n && n.toLowerCase().includes('financial') && n.toLowerCase().includes('report')
    );

    if (!found) {
      console.warn('Migration 20250724: no FinancialReport(s) table found — skipping.');
      return;
    }

    const tableName = found;

    // safe: describe table first
    const columns = await queryInterface.describeTable(tableName).catch(() => null);
    if (!columns) {
      console.warn(`Migration 20250724: describeTable returned null for ${tableName} — skipping.`);
      return;
    }

    // add column only if missing
    if (!columns.date) {
      await queryInterface.addColumn(tableName, 'date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });

      // backfill null values with current date using bulkUpdate (safer than raw SQL)
      await queryInterface.bulkUpdate(
        tableName,
        { date: Sequelize.literal('CURRENT_DATE') },
        { date: null }
      );

      // make NOT NULL
      await queryInterface.changeColumn(tableName, 'date', {
        type: Sequelize.DATEONLY,
        allowNull: false,
      });
    } else {
      console.info(`Migration 20250724: column "date" already exists on ${tableName} — skipping.`);
    }
  },

  async down(queryInterface, Sequelize) {
    const allTables = await queryInterface.showAllTables();
    const tableList = allTables.map(t => (typeof t === 'object' ? (t.tableName || t.name || '') : String(t)));
    const found = tableList.find(
      n => n && n.toLowerCase().includes('financial') && n.toLowerCase().includes('report')
    );

    if (!found) {
      console.warn('Migration 20250724 down: no FinancialReport(s) table found — nothing to do.');
      return;
    }

    const tableName = found;
    const columns = await queryInterface.describeTable(tableName).catch(() => null);
    if (columns && columns.date) {
      await queryInterface.removeColumn(tableName, 'date');
    } else {
      console.info(`Migration 20250724 down: column "date" not present on ${tableName} — skipping.`);
    }
  },
};
