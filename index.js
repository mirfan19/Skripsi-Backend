const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/product', express.static(path.join(__dirname, 'uploads/product')));

// Routes with consistent prefixes
app.use("/api/products", routes.productRoutes);
app.use("/api/auth", routes.authRoutes);
app.use("/api/users", routes.userRoutes);
app.use("/api/orders", routes.orderRoutes);
app.use("/api/order-items", routes.orderItemRoutes);
app.use("/api/wishlists", routes.wishlistRoutes);
app.use("/api/transactions", routes.transactionRoutes);
app.use("/api/payments", routes.paymentRoutes);
app.use("/api/suppliers", routes.supplierRoutes);
app.use("/api/cart", routes.cartRoutes); // Make sure this line is present

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
