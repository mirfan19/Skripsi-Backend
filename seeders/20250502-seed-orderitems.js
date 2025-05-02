'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('OrderItems', [
      {
        OrderID: 1, // Replace with an existing OrderID
        ProductID: 1, // Replace with an existing ProductID
        Quantity: 2,
        Price: 15000.00,
      },
      {
        OrderID: 1, // Replace with an existing OrderID
        ProductID: 2, // Replace with an existing ProductID
        Quantity: 1,
        Price: 20000.00,
      },
      {
        OrderID: 2, // Replace with an existing OrderID
        ProductID: 3, // Replace with an existing ProductID
        Quantity: 3,
        Price: 10000.00,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OrderItems', null, {});
  },
};