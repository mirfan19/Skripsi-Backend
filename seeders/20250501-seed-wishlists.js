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
      console.warn('Users or Products not found. Please seed users and products first.');
      return;
    }

    // Build wishlists only for available users/products
    const wishlists = [];
    if (users[0] && products[0]) {
      wishlists.push({
        UserID: users[0].UserID,
        ProductID: products[0].ProductID,
        AddedDate: new Date(),
      });
    }
    if (users[1] && products[1]) {
      wishlists.push({
        UserID: users[1].UserID,
        ProductID: products[1].ProductID,
        AddedDate: new Date(),
      });
    }
    if (users[1] && products[2]) {
      wishlists.push({
        UserID: users[1].UserID,
        ProductID: products[2].ProductID,
        AddedDate: new Date(),
      });
    }
    if (users[2] && products[0]) {
      wishlists.push({
        UserID: users[2].UserID,
        ProductID: products[0].ProductID,
        AddedDate: new Date(),
      });
    }

    if (wishlists.length > 0) {
      return queryInterface.bulkInsert('Wishlists', wishlists);
    } else {
      console.warn('No wishlists inserted: not enough users or products.');
      return;
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Wishlists', null, {});
  },
};