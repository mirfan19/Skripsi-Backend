'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get existing orders
    const orders = await queryInterface.sequelize.query(
      'SELECT "OrderID" from "Orders";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Check if we have orders
    if (orders.length === 0) {
      throw new Error('No orders found. Please seed orders first.');
    }

    // Get existing products
    const products = await queryInterface.sequelize.query(
      'SELECT "ProductID" from "Products";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (products.length === 0) {
      throw new Error('No products found. Please seed products first.');
    }

    return queryInterface.bulkInsert('OrderItems', [
      {
        OrderID: orders[0].OrderID,
        ProductID: products[0].ProductID,
        Quantity: 2,
        Price: 15000.00,
      },
      {
        OrderID: orders[0].OrderID,
        ProductID: products[1].ProductID,
        Quantity: 1,
        Price: 20000.00,
      },
      {
        OrderID: orders[1].OrderID,
        ProductID: products[2].ProductID,
        Quantity: 3,
        Price: 10000.00,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OrderItems', null, {});
  },
};