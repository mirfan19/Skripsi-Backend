'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // pastikan ada user dulu
    const [users] = await queryInterface.sequelize.query(
      `SELECT "UserID" FROM "Users" ORDER BY "UserID" ASC`
    );
    if (!users || users.length === 0) {
      console.warn('Seed orders skipped: no users found. Seed users first.');
      return;
    }

    // cek apakah tabel Orders punya createdAt/updatedAt
    const tableInfo = await queryInterface.describeTable('Orders').catch(() => null);
    const includeTimestamps = tableInfo && (tableInfo.createdAt || tableInfo.updatedAt);

    const baseOrder = {
      UserID: users[0].UserID,
      OrderDate: now,
      TotalAmount: 150000,
      Status: 'Paid'
    };

    if (includeTimestamps) {
      baseOrder.createdAt = now;
      baseOrder.updatedAt = now;
    }

    await queryInterface.bulkInsert('Orders', [ baseOrder ], {});
  },

  async down(queryInterface /* Sequelize */) {
    await queryInterface.bulkDelete('Orders', { TotalAmount: 150000 }, {});
  }
};