'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      OrderID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: { // Updated to UserID
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Updated to reference Users table
          key: 'UserID', // Primary key in the Users table
        },
        onDelete: 'CASCADE', // Deletes orders if the user is deleted
        onUpdate: 'CASCADE', // Updates orders if the user ID changes
      },
      OrderDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      TotalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      Status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  },
};
