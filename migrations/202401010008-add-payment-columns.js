'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();

    try {
      // Get existing columns
      const tableInfo = await queryInterface.describeTable('Payments');

      // Add PaymentToken if it doesn't exist
      if (!tableInfo.PaymentToken) {
        await queryInterface.addColumn('Payments', 'PaymentToken', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction: t });
      }

      // Add MidtransOrderID if it doesn't exist
      if (!tableInfo.MidtransOrderID) {
        await queryInterface.addColumn('Payments', 'MidtransOrderID', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction: t });
      }

      // Add indexes
      try {
        await queryInterface.addIndex('Payments', ['PaymentToken'], {
          name: 'payments_payment_token_idx',
          transaction: t
        });
      } catch (error) {
        console.log('PaymentToken index might already exist');
      }

      try {
        await queryInterface.addIndex('Payments', ['MidtransOrderID'], {
          name: 'payments_midtrans_order_id_idx',
          transaction: t
        });
      } catch (error) {
        console.log('MidtransOrderID index might already exist');
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();

    try {
      // Remove indexes first
      try {
        await queryInterface.removeIndex('Payments', 'payments_payment_token_idx', { transaction: t });
      } catch (error) {
        console.log('Error removing PaymentToken index:', error.message);
      }
      
      try {
        await queryInterface.removeIndex('Payments', 'payments_midtrans_order_id_idx', { transaction: t });
      } catch (error) {
        console.log('Error removing MidtransOrderID index:', error.message);
      }

      // Remove columns if they exist
      const tableInfo = await queryInterface.describeTable('Payments');
      
      if (tableInfo.PaymentToken) {
        await queryInterface.removeColumn('Payments', 'PaymentToken', { transaction: t });
      }
      
      if (tableInfo.MidtransOrderID) {
        await queryInterface.removeColumn('Payments', 'MidtransOrderID', { transaction: t });
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
};