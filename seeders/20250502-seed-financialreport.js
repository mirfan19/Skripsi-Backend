'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Tambahkan kolom date yang nullable
    await queryInterface.addColumn('FinancialReport', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    return queryInterface.bulkInsert('FinancialReport', [
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
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // 3. Ubah kolom jadi NOT NULL
    await queryInterface.changeColumn('FinancialReport', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

    return queryInterface.bulkDelete('FinancialReport', null, {});
  },
};