'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'Role', {
      type: Sequelize.ENUM('admin', 'user'),
      defaultValue: 'user',
      allowNull: false
    });

    // Create admin user if it doesn't exist
    const adminUser = await queryInterface.sequelize.query(
      `SELECT * FROM "Users" WHERE "Role" = 'admin' LIMIT 1`
    );

    if (!adminUser[0].length) {
      await queryInterface.bulkInsert('Users', [{
        Username: 'admin',
        Password: '$2b$10$kNOXBiCQGYjDMR1VMaFgfOh1FF6YK1nGxpd9VPuvYK3VbPwVBhqEm', // password: admin123
        Email: 'admin@tokoilham.com',
        Role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'Role');
  }
};
