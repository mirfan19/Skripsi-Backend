'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Transactions', [
      {
        OrderID: 1, // Replace with an existing OrderID
        PaymentID: 1, // Replace with an existing PaymentID
        TransactionDate: new Date(),
        Amount: 50000.00,
      },
      {
        OrderID: 2, // Replace with an existing OrderID
        PaymentID: 2, // Replace with an existing PaymentID
        TransactionDate: new Date(),
        Amount: 75000.00,
      },
      {
        OrderID: 3, // Replace with an existing OrderID
        PaymentID: 3, // Replace with an existing PaymentID
        TransactionDate: new Date(),
        Amount: 30000.00,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Transactions', null, {});
  },
};