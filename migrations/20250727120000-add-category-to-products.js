'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // safe check: hanya tambahkan kalau kolom belum ada
    const table = await queryInterface.describeTable('Products').catch(() => null);
    if (!table) return;
    if (!table.Category) {
      await queryInterface.addColumn('Products', 'Category', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Lainnya',
      });
    } else {
      // sudah ada -> skip
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Products').catch(() => null);
    if (!table) return;
    if (table.Category) {
      await queryInterface.removeColumn('Products', 'Category');
    }
  },
};
