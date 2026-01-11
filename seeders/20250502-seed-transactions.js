'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get existing orders
    const orders = await queryInterface.sequelize.query(
      'SELECT "OrderID" from "Orders";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Get existing payments
    const payments = await queryInterface.sequelize.query(
      'SELECT "PaymentID" from "Payments";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (orders.length === 0 || payments.length === 0) {
      console.warn('No orders or payments found. Please seed orders and payments first.');
      return;
    }

    // Build transactions only for available orders/payments
    const transactions = [];
    if (orders[0] && payments[0]) {
      transactions.push({
        OrderID: orders[0].OrderID,
        PaymentID: payments[0].PaymentID,
        TransactionDate: new Date(),
        Amount: 50000.00,
      });
    }
    if (orders[1] && payments[1]) {
      transactions.push({
        OrderID: orders[1].OrderID,
        PaymentID: payments[1].PaymentID,
        TransactionDate: new Date(),
        Amount: 75000.00,
      });
    }
    if (orders[2] && payments[2]) {
      transactions.push({
        OrderID: orders[2].OrderID,
        PaymentID: payments[2].PaymentID,
        TransactionDate: new Date(),
        Amount: 30000.00,
      });
    }

    if (transactions.length > 0) {
      return queryInterface.bulkInsert('Transactions', transactions);
    } else {
      console.warn('No transactions inserted: not enough orders or payments.');
      return;
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Transactions', null, {});
  },
};