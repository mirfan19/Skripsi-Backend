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

    await queryInterface.bulkDelete('OrderItems', null, { restartIdentity: true });

    const orderItems = [];
    orders.forEach((order) => {
      // Add at least one item to every order
      orderItems.push({
        OrderID: order.OrderID,
        ProductID: products[Math.floor(Math.random() * products.length)].ProductID,
        Quantity: Math.floor(Math.random() * 3) + 1,
        Price: 15000.00,
      });
    });

    return queryInterface.bulkInsert('OrderItems', orderItems);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OrderItems', null, {});
  },
};