'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get existing orders
    const orders = await queryInterface.sequelize.query(
      'SELECT "OrderID" from "Orders";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (orders.length === 0) {
      throw new Error('No orders found. Please seed orders first.');
    }

    // Get existing payments
    const payments = await queryInterface.sequelize.query(
      'SELECT "PaymentID" from "Payments";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (payments.length === 0) {
      throw new Error('No payments found. Please seed payments first.');
    }

    return queryInterface.bulkInsert('Transactions', [
      {
        OrderID: orders[0].OrderID,
        PaymentID: payments[0].PaymentID,
        TransactionDate: new Date(),
        Amount: 50000.00,
      },
      {
        OrderID: orders[1].OrderID,
        PaymentID: payments[1].PaymentID,
        TransactionDate: new Date(),
        Amount: 75000.00,
      },
      {
        OrderID: orders[2].OrderID,
        PaymentID: payments[2].PaymentID,
        TransactionDate: new Date(),
        Amount: 30000.00,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Transactions', null, {});
  },
};