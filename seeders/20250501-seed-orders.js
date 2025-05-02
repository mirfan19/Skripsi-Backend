'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Orders', [
      {
        UserID: 1, // Replace with an existing UserID
        OrderDate: new Date(),
        TotalAmount: 50000.00,
        Status: 'Pending',
      },
      {
        UserID: 2, // Replace with an existing UserID
        OrderDate: new Date(),
        TotalAmount: 75000.00,
        Status: 'Completed',
      },
      {
        UserID: 1, // Replace with an existing UserID
        OrderDate: new Date(),
        TotalAmount: 30000.00,
        Status: 'Cancelled',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Orders', null, {});
  },
};