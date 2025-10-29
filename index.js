'use strict';

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require('serverless-http');
require('dotenv').config();

// quick guard: require DATABASE_URL or DB_HOST before attempting DB connect
const dbHost = process.env.DATABASE_URL || process.env.DB_HOST;
if (!dbHost) {
  // clear message so Vercel logs show why it failed
  console.error('Missing DB config: set DATABASE_URL (preferred) or DB_HOST/DB_USER/DB_PASSWORD in env.');
  process.exit(1);
}

const db = require("./models");
const { router: mainRouter } = require("./routes");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool (only if DATABASE_URL provided)
let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
  });

  pool.connect()
    .then(() => console.log("Connected to Supabase PostgreSQL 🚀"))
    .catch(err => console.error("Connection error", err.stack));
} else {
  console.warn('No DATABASE_URL provided — skipping direct pg Pool connection.');
}

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/product', express.static(path.join(__dirname, 'uploads/product')));
app.use("/api", mainRouter);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// export serverless handler for Vercel
if (process.env.VERCEL) {
  module.exports = serverless(app);
} else {
  // start normal server locally / in non-vercel env
  (async function start() {
    try {
      if (db && db.sequelize) {
        if (process.env.NODE_ENV === 'production') {
          await db.sequelize.authenticate();
        } else {
          await db.sequelize.sync();
        }
      }
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (err) {
      console.error('Unable to connect to the database:', err);
      process.exit(1);
    }
  })();
}
