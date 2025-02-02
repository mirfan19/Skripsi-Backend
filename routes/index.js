const express = require("express");
const router = express.Router();

// Import route modules
const customerRoute = require("./customerRoutes");
const adminRoute = require("./adminRoutes");
const productRoute = require("./productRoutes");
const orderRoute = require("./orderRoutes");
const orderItemRoute = require("./orderItemRoutes");
const wishlistRoute = require("./wishlistRoutes");
const transactionRoute = require("./transactionRoutes");
const paymentRoute = require("./paymentRoutes");
const supplierRoute = require("./supplierRoutes");
const activityLogRoute = require("./activityLogRoutes");

// Default route
router.get("/", (req, res) => {
    res.json({
        message: "Hello to the API",
    });
});

// Use route modules
router.use("/v1/customers", customerRoute);
router.use("/v1/admins", adminRoute);
router.use("/v1/products", productRoute);
router.use("/v1/orders", orderRoute);
router.use("/v1/orderItems", orderItemRoute);
router.use("/v1/wishlists", wishlistRoute);
router.use("/v1/transactions", transactionRoute);
router.use("/v1/payments", paymentRoute);
router.use("/v1/suppliers", supplierRoute);
router.use("/v1/activityLogs", activityLogRoute);

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

module.exports = router;