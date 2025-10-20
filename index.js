const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const { router: mainRouter, ...routes } = require("./routes");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // from Supabase
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("Connected to Supabase PostgreSQL 🚀"))
  .catch(err => console.error("Connection error", err.stack));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/product', express.static(path.join(__dirname, 'uploads/product')));

// Use main router for all API routes
app.use("/api", mainRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start server with database sync
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = pool;
