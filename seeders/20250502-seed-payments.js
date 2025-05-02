'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Payments', [
      {
        PaymentMethod: 'Credit Card',
        PaymentDate: new Date(),
        Amount: 50000.00,
      },
      {
        PaymentMethod: 'Bank Transfer',
        PaymentDate: new Date(),
        Amount: 75000.00,
      },
      {
        PaymentMethod: 'Cash',
        PaymentDate: new Date(),
        Amount: 30000.00,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Payments', null, {});
  },
};