const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const wishlistController = require('../controllers/wishlistController');

// Create a new user
router.post('/', userController.createUser);

// Retrieve all users
router.get('/', userController.getAllUsers);

// Find a single user by ID
router.get('/:id', userController.getUserById);

// Update a user by ID
router.put('/:id', userController.updateUser);

// Delete a user by ID
router.delete('/:id', userController.deleteUser);

// View product catalog
router.get('/products', productController.getProductCatalog);

// Add item to order
router.post('/orders/addItem', orderController.addItemToOrder);

// Checkout order
router.post('/orders/checkout', orderController.checkoutOrder);

// View order status
router.get('/orders/:id/status', orderController.getOrderStatus);

// View order history
router.get('/:userId/orders', orderController.getOrderHistory);

// View wishlist
router.get('/:userId/wishlist', wishlistController.getAllWishlists);

module.exports = router;