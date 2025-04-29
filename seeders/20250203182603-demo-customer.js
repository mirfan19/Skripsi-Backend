'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        Username: 'customer1',
        Password: await bcrypt.hash('password1', 10),
        Email: 'customer1@example.com',
        Phone: '1234567890',
        Address: '123 Main St',
        Role: 'customer',
        RegistrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Username: 'customer2',
        Password: await bcrypt.hash('password2', 10),
        Email: 'customer2@example.com',
        Phone: '0987654321',
        Address: '456 Elm St',
        Role: 'customer',
        RegistrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
