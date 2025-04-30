'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Suppliers', [
      {
        SupplierName: 'Supplier A',
        ContactName: 'John Doe',
        Phone: '1234567890',
        Email: 'supplierA@example.com',
        Address: '123 Supplier St',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        SupplierName: 'Supplier B',
        ContactName: 'Jane Smith',
        Phone: '0987654321',
        Email: 'supplierB@example.com',
        Address: '456 Supplier Ave',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Suppliers', null, {});
  },
};