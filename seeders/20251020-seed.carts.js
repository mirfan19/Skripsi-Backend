'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ensure Carts table exists
    const tableInfo = await queryInterface.describeTable('Carts').catch(() => null);
    if (!tableInfo) {
      console.warn('Carts table not found — skipping carts seeder.');
      return;
    }

    // fetch some existing users and products
    const users = await queryInterface.sequelize.query(
      'SELECT "UserID" FROM "Users" ORDER BY "UserID" ASC;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const products = await queryInterface.sequelize.query(
      'SELECT "ProductID" FROM "Products" ORDER BY "ProductID" ASC;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !products.length) {
      console.warn('No users or products found — skipping carts seeder. Seed users and products first.');
      return;
    }

    const needsTimestamps = !!(tableInfo.createdAt || tableInfo.updatedAt);
    const now = new Date();

    const rows = [
      {
        UserID: users[0].UserID,
        ProductID: products[0].ProductID,
        Quantity: 1,
      },
      {
        UserID: users[1] ? users[1].UserID : users[0].UserID,
        ProductID: products[1] ? products[1].ProductID : products[0].ProductID,
        Quantity: 2,
      },
    ];

    if (needsTimestamps) {
      rows.forEach(r => {
        r.createdAt = now;
        r.updatedAt = now;
      });
    }

    return queryInterface.bulkInsert('Carts', rows, {});
  },

  down: async (queryInterface, Sequelize) => {
    // remove all seeded carts (adjust condition if you want to be more specific)
    return queryInterface.bulkDelete('Carts', null, {});
  }
};