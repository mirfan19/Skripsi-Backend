'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // pastikan ada tabel Payments
    const paymentsTable = await queryInterface.describeTable('Payments').catch(() => null);
    if (!paymentsTable) {
      console.warn('Payments table not found — skipping payments seeder.');
      return;
    }

    // cari user untuk membuat order jika perlu
    const [users] = await queryInterface.sequelize.query(
      `SELECT "UserID" FROM "Users" ORDER BY "UserID" ASC LIMIT 1`
    );
    if (!users || users.length === 0) {
      console.warn('No users found — skipping payments seeder.');
      return;
    }
    const userId = users[0].UserID;

    // cari order yang ada
    const [orders] = await queryInterface.sequelize.query(
      `SELECT "OrderID" FROM "Orders" ORDER BY "OrderID" ASC LIMIT 1`
    );

    let orderId;
    if (orders && orders.length > 0) {
      orderId = orders[0].OrderID;
    } else {
      // buat order sementara dan ambil id (RETURNING)
      const now = new Date();
      // cek apakah Orders punya createdAt/updatedAt
      const ordersTable = await queryInterface.describeTable('Orders').catch(() => null);
      const includeTimestamps = ordersTable && (ordersTable.createdAt || ordersTable.updatedAt);

      const values = includeTimestamps
        ? `(${userId}, '${now.toISOString()}', 0.00, 'Pending', now, now)`
        : `(${userId}, '${now.toISOString()}', 0.00, 'Pending')`;

      // sesuaikan nama kolom jika berbeda; gunakan RETURNING "OrderID"
      const insertSql = includeTimestamps
        ? `INSERT INTO "Orders" ("UserID","OrderDate","TotalAmount","Status","createdAt","updatedAt") VALUES ${values} RETURNING "OrderID";`
        : `INSERT INTO "Orders" ("UserID","OrderDate","TotalAmount","Status") VALUES ${values} RETURNING "OrderID";`;

      const [res] = await queryInterface.sequelize.query(insertSql);
      if (res && res[0] && (res[0].OrderID || res[0].orderid)) {
        orderId = res[0].OrderID || res[0].orderid;
      } else {
        console.warn('Failed to create a temporary order — skipping payments seeder.');
        return;
      }
    }

    const now = new Date();
    const rows = [
      {
        OrderID: orderId,
        PaymentMethod: 'Credit Card',
        PaymentDate: now,
        Amount: 50000.00,
        Status: paymentsTable.Status ? 'Pending' : undefined,
      },
      {
        OrderID: orderId,
        PaymentMethod: 'Bank Transfer',
        PaymentDate: now,
        Amount: 75000.00,
        Status: paymentsTable.Status ? 'Pending' : undefined,
      },
      {
        OrderID: orderId,
        PaymentMethod: 'Cash',
        PaymentDate: now,
        Amount: 30000.00,
        Status: paymentsTable.Status ? 'Pending' : undefined,
      },
    ];

    // tambahkan timestamps jika tabel punya
    if (paymentsTable.createdAt || paymentsTable.updatedAt) {
      rows.forEach(r => {
        r.createdAt = now;
        r.updatedAt = now;
      });
    }

    // hapus undefined props agar bulkInsert tidak error
    const cleanRows = rows.map(r => {
      Object.keys(r).forEach(k => r[k] === undefined && delete r[k]);
      return r;
    });

    return queryInterface.bulkInsert('Payments', cleanRows, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Payments', {
      Amount: { [Op.in]: [50000.00, 75000.00, 30000.00] }
    }, {});
  },
};