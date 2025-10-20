'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // avoid statement timeout on large DB
      await queryInterface.sequelize.query("SET statement_timeout = 0;");

      const table = await queryInterface.describeTable('Suppliers').catch(() => null);
      if (!table) {
        console.warn('Table "Suppliers" not found — skipping timestamps addition.');
        return;
      }

      if (!table.createdAt) {
        await queryInterface.addColumn('Suppliers', 'createdAt', {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
      }

      if (!table.updatedAt) {
        await queryInterface.addColumn('Suppliers', 'updatedAt', {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
      }
    } catch (err) {
      console.error('Migration 20250728 up failed:', err);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      const table = await queryInterface.describeTable('Suppliers').catch(() => null);
      if (!table) return;

      if (table.updatedAt) {
        await queryInterface.removeColumn('Suppliers', 'updatedAt');
      }
      if (table.createdAt) {
        await queryInterface.removeColumn('Suppliers', 'createdAt');
      }
    } catch (err) {
      console.error('Migration 20250728 down failed:', err);
      throw err;
    }
  },
};
