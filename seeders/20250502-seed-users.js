'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    return queryInterface.bulkInsert('Users', [
      {
        Username: 'admin',
        Password: hashedPassword,
        Email: 'admin@example.com',
        Phone: '081234567890',
        Role: 'admin',
        Address: 'Admin Address',
        RegistrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Username: 'user1',
        Password: hashedPassword,
        Email: 'user1@example.com',
        Phone: '081234567891',
        Role: 'user',
        Address: 'User 1 Address',
        RegistrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Username: 'user2',
        Password: hashedPassword,
        Email: 'user2@example.com',
        Phone: '081234567892',
        Role: 'user',
        Address: 'User 2 Address',
        RegistrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};