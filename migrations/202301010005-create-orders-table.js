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
      CustomerID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Customers', // References the Customers table
          key: 'CustomerID', // Primary key in the Customers table
        },
        onDelete: 'CASCADE', // Deletes orders if the customer is deleted
        onUpdate: 'CASCADE', // Updates orders if the customer ID changes
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
