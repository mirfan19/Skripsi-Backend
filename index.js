const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models"); // Import the models
const routes = require("./routes"); // Import the routes
const authRoutes = require('./routes/authRoutes'); // Import auth routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use("/api", routes);
app.use("/auth", authRoutes); // Use auth routes

// Sync database and start server
db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
