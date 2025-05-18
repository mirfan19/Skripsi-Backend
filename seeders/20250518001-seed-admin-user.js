'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    return queryInterface.bulkInsert('Users', [{
      Username: 'admin',
      Email: 'admin@tokoperlengkapan.com',
      Password: hashedPassword,
      Phone: '123456789',
      Role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', { Username: 'admin' }, {});
  }
};
