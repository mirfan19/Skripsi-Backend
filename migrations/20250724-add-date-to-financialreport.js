'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add the column as nullable
    await queryInterface.addColumn('FinancialReport', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    // 2. Fill all existing rows with a default value (today's date)
    await queryInterface.sequelize.query(
      `UPDATE "FinancialReport" SET "date" = '2024-07-24' WHERE "date" IS NULL;`
    );
    // 3. Change the column to NOT NULL
    await queryInterface.changeColumn('FinancialReport', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('FinancialReport', 'date');
  },
};
