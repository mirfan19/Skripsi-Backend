'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      UserID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Role: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      RegistrationDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop FK di Wishlists jika ada
    try {
      await queryInterface.removeConstraint('Wishlists', 'Wishlists_UserID_fkey');
    } catch (e) {}
    await queryInterface.dropTable('Users');
  }
};
