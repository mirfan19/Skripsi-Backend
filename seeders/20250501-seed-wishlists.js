'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Wishlists', [
      {
        UserID: 1, // Replace with an existing UserID
        ProductID: 1, // Replace with an existing ProductID
        AddedDate: new Date(),
      },
      {
        UserID: 2, // Replace with an existing UserID
        ProductID: 2, // Replace with an existing ProductID
        AddedDate: new Date(),
      },
      {
        UserID: 1, // Replace with an existing UserID
        ProductID: 3, // Replace with an existing ProductID
        AddedDate: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Wishlists', null, {});
  },
};