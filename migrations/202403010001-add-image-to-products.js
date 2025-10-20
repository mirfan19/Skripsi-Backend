'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // safe check: only add column if it doesn't exist
    const table = await queryInterface.describeTable('Products').catch(() => null);
    if (!table) return;
    if (!table.ImageURL) {
      await queryInterface.addColumn('Products', 'ImageURL', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    } else {
      // already exists, skip
      // console.log('Products.ImageURL already exists — skipping');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Products').catch(() => null);
    if (!table) return;
    if (table.ImageURL) {
      await queryInterface.removeColumn('Products', 'ImageURL');
    }
  }
};