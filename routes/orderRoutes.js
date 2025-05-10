const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Retrieve all orders
router.get('/', orderController.getAllOrders);

// Find a single order by ID
router.get('/:OrderID', orderController.getOrderById);  // Changed from :id to :OrderID

// Update an order by ID
router.put('/:OrderID', orderController.updateOrder);   // Changed from :id to :OrderID

// Delete an order by ID
router.delete('/:OrderID', orderController.deleteOrder); // Changed from :id to :OrderID

module.exports = router;
