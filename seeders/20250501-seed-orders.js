'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT "UserID" from "Users";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      throw new Error('No users found. Please seed users first.');
    }

    return queryInterface.bulkInsert('Orders', [
      {
        UserID: users[0].UserID,
        OrderDate: new Date(),
        TotalAmount: 50000.00,
        Status: 'Pending',
      },
      {
        UserID: users[0].UserID,
        OrderDate: new Date(),
        TotalAmount: 75000.00,
        Status: 'Completed',
      },
      {
        UserID: users[1].UserID,
        OrderDate: new Date(),
        TotalAmount: 30000.00,
        Status: 'Processing',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Orders', null, {});
  },
};