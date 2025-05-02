'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('FinancialReport', [
      {
        income: 1000000.00,
        expenses: 400000.00,
        gross_revenue: 600000.00,
        net_revenue: 500000.00,
      },
      {
        income: 2000000.00,
        expenses: 800000.00,
        gross_revenue: 1200000.00,
        net_revenue: 1000000.00,
      },
      {
        income: 1500000.00,
        expenses: 500000.00,
        gross_revenue: 1000000.00,
        net_revenue: 900000.00,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('FinancialReport', null, {});
  },
};