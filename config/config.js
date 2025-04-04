require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'your_database',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false, // Disable query logging
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false, // Disable query logging
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false, // Disable query logging
  },
};
