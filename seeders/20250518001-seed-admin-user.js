'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword2 = await bcrypt.hash('admin456', 10);
    const hashedPassword3 = await bcrypt.hash('admin789', 10);
    
    return queryInterface.bulkInsert('Users', [
      {
        Username: 'admin2',
        Email: 'admin2@tokoperlengkapan.com',
        Password: hashedPassword2,
        Phone: '987654321',
        Role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Username: 'admin3',
        Email: 'admin3@tokoperlengkapan.com',
        Password: hashedPassword3,
        Phone: '456789123',
        Role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', { 
      Username: {
        [Sequelize.Op.in]: ['admin2', 'admin3']
      } 
    }, {});
  }
};
