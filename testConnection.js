const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('firstproject', 'postgres', 'irf4n', {
  host: 'localhost', // atau host lain jika di server
  dialect: 'postgres'
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi ke PostgreSQL berhasil!');
  } catch (error) {
    console.error('❌ Koneksi gagal:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();