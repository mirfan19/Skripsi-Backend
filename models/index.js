'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

let config = null;
try {
  const configPath = path.resolve(__dirname, '..', 'config', 'config.js');
  if (fs.existsSync(configPath)) {
    const cfg = require(configPath);
    // support either object with env keys or a single config object
    config = cfg[env] || cfg;
  }
} catch (err) {
  // ignore - we'll attempt to use env vars below
}

if (!config) {
  if (process.env.DATABASE_URL) {
    config = { use_env_variable: 'DATABASE_URL' };
  } else if (process.env.DB_HOST) {
    config = {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres'
    };
  }
}

if (!config) {
  console.error('Database config missing. Provide config/config.js or DATABASE_URL/DB_* env vars.');
  throw new Error('Database configuration is undefined');
}

let sequelize;
if (config.use_env_variable) {
  const connString = process.env[config.use_env_variable] || process.env.DATABASE_URL;
  sequelize = new Sequelize(connString, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: process.env.DB_SSL === 'disable' ? {} : { ssl: { rejectUnauthorized: false } },
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port || 5432,
    dialect: config.dialect || 'postgres',
    logging: false,
    dialectOptions: process.env.DB_SSL === 'disable' ? {} : { ssl: { rejectUnauthorized: false } },
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
