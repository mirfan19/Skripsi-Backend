'use strict';

const bcrypt = require('bcryptjs'); // Import bcrypt

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admins', [
      {
        Username: 'admin1',
        Password: await bcrypt.hash('password1', 10),
        Email: 'admin1@example.com',
        Phone: '1234567890',
        Role: 'user',
        RegistrationDate: new Date()
      },
      {
        Username: 'admin2',
        Password: await bcrypt.hash('password2', 10),
        Email: 'admin2@example.com',
        Phone: '0987654321',
        Role: 'user',
        RegistrationDate: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', null, {});
  }
};
