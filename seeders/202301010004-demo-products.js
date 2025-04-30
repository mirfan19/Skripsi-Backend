'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [
      {
        ProductName: 'Pensil 2B',
        Description: 'Pensil untuk menulis dan menggambar',
        Price: 2500.00,
        StockQuantity: 100,
        SupplierID: 1, // Matches Supplier A
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ProductName: 'Buku Tulis',
        Description: 'Buku untuk catatan',
        Price: 5000.00,
        StockQuantity: 50,
        SupplierID: 2, // Matches Supplier B
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ProductName: 'Pulpen Hitam',
        Description: 'Pulpen untuk menulis',
        Price: 3000.00,
        StockQuantity: 75,
        SupplierID: 1, // Matches Supplier A
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  },
};