const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const orderItemRoutes = require("./orderItemRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const transactionRoutes = require("./transactionRoutes");
const paymentRoutes = require("./paymentRoutes");
const supplierRoutes = require("./supplierRoutes");
const transactionSummaryRoutes = require("./transactionSummaryRoutes");
const financialReportRoutes = require("./financialReportRoutes");
const authRoutes = require("./authRoutes");
const cartRoutes = require("./cartRoutes");
const adminRoutes = require("./adminRoutes");

// Default route
router.get("/", (req, res) => {
    res.json({
        message: "Hello to the API",
    });
});

// Use route modules
router.use("/v1/users", userRoutes);
router.use("/v1/products", productRoutes);
router.use("/v1/orders", orderRoutes);
router.use("/v1/orderItems", orderItemRoutes);
router.use("/v1/wishlists", wishlistRoutes);
router.use("/v1/transactions", transactionRoutes);
router.use("/v1/payments", paymentRoutes);
router.use("/v1/suppliers", supplierRoutes);
router.use("/v1/transactionSummaries", transactionSummaryRoutes);
router.use("/v1/financialReports", financialReportRoutes);
router.use("/v1/auth", authRoutes);
router.use("/v1/cart", cartRoutes);
router.use("/v1/admin", adminRoutes);

// 404 Not Found handler
router.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// Global error handler
router.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

// Export the router and all route modules
module.exports = {
    router,
    userRoutes,
    productRoutes,
    orderRoutes,
    orderItemRoutes,
    wishlistRoutes,
    transactionRoutes,
    paymentRoutes,
    supplierRoutes,
    transactionSummaryRoutes,
    financialReportRoutes,
    authRoutes,
    cartRoutes,
    adminRoutes
};
