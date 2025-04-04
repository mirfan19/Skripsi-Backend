'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the Admins table to Users
    await queryInterface.renameTable('Admins', 'Users');

    // Add Address column to Users table (from Customers table)
    await queryInterface.addColumn('Users', 'Address', {
      type: Sequelize.STRING,
      allowNull: true, // Allow null since admins may not have an address
    });

    // Add UserID as the primary key
    await queryInterface.addColumn('Users', 'UserID', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    });

    // Update foreign key in Orders
    await queryInterface.changeColumn('Orders', 'UserID', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'UserID',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Update foreign key in Wishlists
    await queryInterface.changeColumn('Wishlists', 'UserID', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'UserID',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Remove the Role column if it exists in the Customers table
    // (Admins already have this column, so no action is needed if merging)
    // If the Role column is not needed, you can drop it:
    // await queryInterface.removeColumn('Users', 'Role');

    // Rename the Customers table to Users (if needed)
    // await queryInterface.renameTable('Customers', 'Users');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the Users table back to Admins
    await queryInterface.renameTable('Users', 'Admins');

    // Remove the Address column
    await queryInterface.removeColumn('Admins', 'Address');

    // Remove UserID column
    await queryInterface.removeColumn('Users', 'UserID');

    // Revert foreign key changes in Orders
    await queryInterface.changeColumn('Orders', 'UserID', {
      type: Sequelize.INTEGER,
      references: null,
    });

    // Revert foreign key changes in Wishlists
    await queryInterface.changeColumn('Wishlists', 'UserID', {
      type: Sequelize.INTEGER,
      references: null,
    });

    // Optionally, recreate the Customers table if needed
    // await queryInterface.renameTable('Users', 'Customers');
  },
};
