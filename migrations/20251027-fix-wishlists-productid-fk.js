'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // avoid long running statement timeouts
    await queryInterface.sequelize.query("SET statement_timeout = 0;");

    // ensure table exists
    const tbl = await queryInterface.describeTable('Wishlists').catch(() => null);
    if (!tbl) return;

    // 1) Remove rows that will block NOT NULL / FK enforcement (destructive)
    //    If you prefer non-destructive, change this DELETE to UPDATE ... SET "ProductID" = NULL and add FK with ON DELETE SET NULL.
    await queryInterface.sequelize.query(`
      DELETE FROM "Wishlists" w
      WHERE w."ProductID" IS NULL
         OR NOT EXISTS (SELECT 1 FROM "Products" p WHERE p."ProductID" = w."ProductID");
    `);

    // 2) verify cleanup
    const [[{ cnt }]] = await queryInterface.sequelize.query(
      `SELECT COUNT(*)::int AS cnt FROM "Wishlists" WHERE "ProductID" IS NULL;`
    );
    if (cnt > 0) {
      throw new Error('Cleanup failed: some Wishlists still have NULL ProductID. Aborting migration.');
    }

    // 3) enforce NOT NULL and add FK
    await queryInterface.sequelize.query(`
      ALTER TABLE "Wishlists" ALTER COLUMN "ProductID" SET NOT NULL;
      ALTER TABLE "Wishlists"
        ADD CONSTRAINT wishlists_productid_fkey
        FOREIGN KEY ("ProductID") REFERENCES "Products"("ProductID")
        ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  down: async (queryInterface /* Sequelize */) => {
    await queryInterface.sequelize.query(`ALTER TABLE "Wishlists" DROP CONSTRAINT IF EXISTS wishlists_productid_fkey;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Wishlists" ALTER COLUMN "ProductID" DROP NOT NULL;`);
  }
};