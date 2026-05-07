'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
let serverless;
try {
  serverless = require('serverless-http');
} catch (e) {
  // module may be absent in local dev until installed; will log on deploy if missing
  serverless = null;
}
require('dotenv').config();

// Removed quick guard because we dynamically resolve DB config in config.js

const db = require('./models');
const { router: mainRouter } = require('./routes');
const { startCronJobs } = require('./scripts/cronJob');

const app = express();

// PostgreSQL connection pool (only if DATABASE_URL provided)
// Rely on Sequelize for connection management
if (!process.env.DATABASE_URL) {
  console.warn('No DATABASE_URL provided.');
}

// CORS configuration
app.use(cors({
  origin: true, // allow all origins
  credentials: true
}));

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/product', express.static(path.join(__dirname, 'uploads/product')));
app.use('/api', mainRouter);

app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    details: err.stack
  });
});

// export for Vercel serverless
if (process.env.VERCEL && serverless) {
  module.exports = serverless(app);
} else if (process.env.VERCEL && !serverless) {
  console.error('serverless-http not installed. Run npm install --save serverless-http');
  process.exit(1);
} else {
  // local/non-vercel start
  const PORT = process.env.PORT || 3000;
  (async function start() {
    try {
      if (db && db.sequelize) {
        if (process.env.NODE_ENV === 'production') {
          await db.sequelize.authenticate();
        } else {
          await db.sequelize.sync();
        }
        // Start cron jobs after successful db connection
        startCronJobs();
      }
      app.listen(PORT, '0.0.0.0', () => console.log(`Server running on ${PORT}`));
    } catch (err) {
      console.error('Unable to connect to the database:', err);
      process.exit(1);
    }
  })();
}
