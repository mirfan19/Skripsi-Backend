'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get existing users first
    const users = await queryInterface.sequelize.query(
      'SELECT "UserID" from "Users";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Get existing products
    const products = await queryInterface.sequelize.query(
      'SELECT "ProductID" from "Products";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Check if we have both users and products
    if (users.length === 0 || products.length === 0) {
      throw new Error('Users or Products not found. Please seed users and products first.');
    }

    return queryInterface.bulkInsert('Wishlists', [
      {
        UserID: users[0].UserID,  // admin user (UserID: 1)
        ProductID: products[0].ProductID,  // Pensil 2B
        AddedDate: new Date(),
      },
      {
        UserID: users[1].UserID,  // user1 (UserID: 2)
        ProductID: products[1].ProductID,  // Buku Tulis
        AddedDate: new Date(),
      },
      {
        UserID: users[1].UserID,  // user1 (UserID: 2)
        ProductID: products[2].ProductID,  // Pulpen Hitam
        AddedDate: new Date(),
      },
      {
        UserID: users[2].UserID,  // user2 (UserID: 3)
        ProductID: products[0].ProductID,  // Pensil 2B
        AddedDate: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Wishlists', null, {});
  },
};