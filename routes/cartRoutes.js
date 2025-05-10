const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.get('/user/:userId', cartController.getCart);
router.put('/:cartId', cartController.updateCartItem);
router.delete('/:cartId', cartController.removeFromCart);
router.delete('/user/:userId', cartController.clearUserCart);

module.exports = router;