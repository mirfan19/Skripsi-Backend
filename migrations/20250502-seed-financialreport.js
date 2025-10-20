'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // cari nama tabel yang sesuai (FinancialReport / FinancialReports)
    const all = await queryInterface.showAllTables();
    const tbls = all.map(t => (typeof t === 'object' ? (t.tableName || t.name || '') : String(t)));
    const tableName = tbls.find(n => n && n.toLowerCase().includes('financial') && n.toLowerCase().includes('report'));
    if (!tableName) {
      console.warn('Migration 20250502: FinancialReport table not found — skipping.');
      return;
    }

    const cols = await queryInterface.describeTable(tableName).catch(() => null);
    if (!cols) {
      console.warn(`Migration 20250502: describeTable returned null for ${tableName} — skipping.`);
      return;
    }

    if (!cols.date) {
      // tambahkan kolom date dengan aman
      await queryInterface.addColumn(tableName, 'date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });

      // backfill nilai kosong -> current_date (opsional)
      await queryInterface.bulkUpdate(tableName, { date: Sequelize.literal('CURRENT_DATE') }, { date: null });

      // bila ingin set NOT NULL setelah backfill, lakukan dalam migrasi terpisah/maintenance window:
      // await queryInterface.changeColumn(tableName, 'date', { type: Sequelize.DATEONLY, allowNull: false });
    } else {
      console.info(`Migration 20250502: column "date" already exists on ${tableName} — skipping.`);
    }
  },

  async down(queryInterface /* Sequelize */) {
    // down: hapus kolom hanya bila ada
    const all = await queryInterface.showAllTables();
    const tbls = all.map(t => (typeof t === 'object' ? (t.tableName || t.name || '') : String(t)));
    const tableName = tbls.find(n => n && n.toLowerCase().includes('financial') && n.toLowerCase().includes('report'));
    if (!tableName) return;

    const cols = await queryInterface.describeTable(tableName).catch(() => null);
    if (cols && cols.date) {
      await queryInterface.removeColumn(tableName, 'date');
    }
  }
};