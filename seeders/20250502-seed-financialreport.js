'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // safe check: table exists?
    const table = await queryInterface.describeTable('FinancialReport').catch(() => null);
    if (!table) {
      console.warn('Seed skipped: "FinancialReport" table not found.');
      return;
    }

    // add column only if missing (but note: schema changes should preferably be in a migration)
    if (!table.date) {
      await queryInterface.addColumn('FinancialReport', 'date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
      }).catch(err => {
        console.warn('Add column skipped or failed:', err.message || err);
      });
    }

    const now = new Date();
    const rows = [
      {
        income: 1000000.00,
        expenses: 400000.00,
        gross_revenue: 600000.00,
        net_revenue: 500000.00,
        date: '2024-07-24',
      },
      {
        income: 2000000.00,
        expenses: 800000.00,
        gross_revenue: 1200000.00,
        net_revenue: 1000000.00,
        date: '2024-07-24',
      },
      {
        income: 1500000.00,
        expenses: 500000.00,
        gross_revenue: 1000000.00,
        net_revenue: 900000.00,
        date: '2024-07-24',
      },
    ];

    // include timestamps only if table has them
    if (table.createdAt || table.updatedAt) {
      rows.forEach(r => {
        r.createdAt = now;
        r.updatedAt = now;
      });
    }

    return queryInterface.bulkInsert('FinancialReport', rows, {});
  },

  down: async (queryInterface, Sequelize) => {
    // remove only the seeded rows (safe) — do NOT change schema in seeder down
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      'FinancialReport',
      {
        date: '2024-07-24',
        income: { [Op.in]: [1000000.00, 2000000.00, 1500000.00] }
      },
      {}
    );
  }
};