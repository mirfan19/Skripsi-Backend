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
        ImageURL: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ProductName: 'Buku Tulis',
        Description: 'Buku untuk catatan',
        Price: 5000.00,
        StockQuantity: 50,
        SupplierID: 2, // Matches Supplier B
        ImageURL: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ProductName: 'Pulpen Hitam',
        Description: 'Pulpen untuk menulis',
        Price: 3000.00,
        StockQuantity: 75,
        SupplierID: 1, // Matches Supplier A
        ImageURL: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Find the ProductIDs of the seeded products
    const products = await queryInterface.sequelize.query(
      `SELECT "ProductID" FROM "Products" WHERE "ProductName" IN ('Pensil 2B', 'Buku Tulis', 'Pulpen Hitam')`
    );
    const productIds = products[0].map(p => p.ProductID);
    if (productIds.length > 0) {
      // Delete related OrderItems first
      await queryInterface.bulkDelete('OrderItems', {
        ProductID: productIds
      });
      // Then delete the products
      await queryInterface.bulkDelete('Products', {
        ProductID: productIds
      });
    }
  },
};