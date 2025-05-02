'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('FinancialReports', [
      {
        Income: 1000000.00,
        Expenses: 400000.00,
        GrossRevenue: 600000.00,
        NetRevenue: 500000.00,
      },
      {
        Income: 2000000.00,
        Expenses: 800000.00,
        GrossRevenue: 1200000.00,
        NetRevenue: 1000000.00,
      },
      {
        Income: 1500000.00,
        Expenses: 500000.00,
        GrossRevenue: 1000000.00,
        NetRevenue: 900000.00,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('FinancialReports', null, {});
  },
};