'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // First, check if TransactionID exists
      const columns = await queryInterface.describeTable('Transactions');
      
      if (!columns.TransactionID) {
        // Remove any existing foreign key constraints
        const constraints = await queryInterface.getForeignKeyReferencesForTable('Transactions');
        for (const constraint of constraints) {
          await queryInterface.removeConstraint('Transactions', constraint.constraintName, { transaction });
        }

        // Add TransactionID column
        await queryInterface.addColumn('Transactions', 'TransactionID', {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        }, { transaction });

        // Re-add the foreign key constraints
        await queryInterface.addConstraint('Transactions', {
          fields: ['OrderID'],
          type: 'foreign key',
          name: 'Transactions_OrderID_fkey',
          references: {
            table: 'Orders',
            field: 'OrderID'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }, { transaction });

        await queryInterface.addConstraint('Transactions', {
          fields: ['PaymentID'],
          type: 'foreign key',
          name: 'Transactions_PaymentID_fkey',
          references: {
            table: 'Payments',
            field: 'PaymentID'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }, { transaction });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remove foreign key constraints first
      await queryInterface.removeConstraint('Transactions', 'Transactions_OrderID_fkey', { transaction });
      await queryInterface.removeConstraint('Transactions', 'Transactions_PaymentID_fkey', { transaction });

      // Remove TransactionID column
      await queryInterface.removeColumn('Transactions', 'TransactionID', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
