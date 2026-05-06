require('dotenv').config();

'use strict';

const dbConfig = {
  dialect: 'postgres',
  dialectOptions: {}
};

if (process.env.DATABASE_URL) {
  dbConfig.use_env_variable = 'DATABASE_URL';
  if (process.env.DB_SSL !== 'false') {
    dbConfig.dialectOptions.ssl = { rejectUnauthorized: false };
  }
} else {
  dbConfig.username = process.env.DB_USERNAME || process.env.DB_USER || 'postgres';
  dbConfig.password = process.env.DB_PASSWORD || null;
  dbConfig.database = process.env.DB_NAME || 'postgres';
  dbConfig.host = process.env.DB_HOST || '127.0.0.1';
  dbConfig.port = process.env.DB_PORT || 5432;
}

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig
};
