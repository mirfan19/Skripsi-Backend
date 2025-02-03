'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Customers', [
      {
        Username: 'customer1',
        Password: await bcrypt.hash('password1', 10),
        Email: 'customer1@example.com',
        Phone: '1234567890',
        Address: '123 Main St',
        RegistrationDate: new Date()
      },
      {
        Username: 'customer2',
        Password: await bcrypt.hash('password2', 10),
        Email: 'customer2@example.com',
        Phone: '0987654321',
        Address: '456 Elm St',
        RegistrationDate: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Customers', null, {});
  }
};