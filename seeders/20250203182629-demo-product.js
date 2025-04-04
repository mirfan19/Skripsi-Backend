'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [
      {
        ProductName: 'Product 1',
        Description: 'Description for product 1',
        Price: 10.00,
        StockQuantity: 100,
        SupplierID: 1
      },
      {
        ProductName: 'Product 2',
        Description: 'Description for product 2',
        Price: 20.00,
        StockQuantity: 200,
        SupplierID: 2
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
