const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models"); // Import the models
const routes = require("./routes"); // Import the routes
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use("/api", routes);
app.use("/auth", authRoutes); // Use auth routes
app.use('/v1/users', userRoutes); // Mount user routes

// Sync database and start server
(async () => {
  try {
    // Sync Transactions table first
    await db.Transaction.sync();
    console.log('Transactions table synced');

    // Sync Payments table
    await db.Payment.sync();
    console.log('Payments table synced');

    // Sync FinancialReport table
    await db.FinancialReport.sync();
    console.log('FinancialReport table synced');

    // Sync TransactionSummary table
    await db.TransactionSummary.sync();
    console.log('TransactionSummary table synced');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})();
