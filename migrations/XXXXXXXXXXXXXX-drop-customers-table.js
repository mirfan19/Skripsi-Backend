'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Replace 'Orders_CustomerID_fkey' and 'Wishlists_CustomerID_fkey' with the actual constraint names
    await queryInterface.removeConstraint('Orders', 'Orders_CustomerID_fkey');
    await queryInterface.removeConstraint('Wishlists', 'Wishlists_CustomerID_fkey');

    // Drop the Customers table
    await queryInterface.dropTable('Customers');
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate the Customers table
    await queryInterface.createTable('Customers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      Phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      RegistrationDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Recreate foreign key constraints
    await queryInterface.addConstraint('Orders', {
      fields: ['CustomerID'],
      type: 'foreign key',
      name: 'Orders_CustomerID_fkey',
      references: {
        table: 'Customers',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Wishlists', {
      fields: ['CustomerID'],
      type: 'foreign key',
      name: 'Wishlists_CustomerID_fkey',
      references: {
        table: 'Customers',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};