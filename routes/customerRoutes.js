const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const wishlistController = require("../controllers/wishlistController");

// Create a new customer
router.post("/", customerController.createCustomer);

// Retrieve all customers
router.get("/", customerController.getAllCustomers);

// Find a single customer by ID
router.get("/:id", customerController.getCustomerById);

// Update a customer by ID
router.put("/:id", customerController.updateCustomer);

// Delete a customer by ID
router.delete("/:id", customerController.deleteCustomer);

// View product catalog
router.get("/products", productController.getProductCatalog);

// Add item to order
router.post("/orders/addItem", orderController.addItemToOrder);

// Checkout order
router.post("/orders/checkout", orderController.checkoutOrder);

// View order status
router.get("/orders/:id/status", orderController.getOrderStatus);

// View order history
router.get("/:customerId/orders", orderController.getOrderHistory);

// View wishlist
router.get("/:customerId/wishlist", wishlistController.getAllWishlists);

module.exports = router;