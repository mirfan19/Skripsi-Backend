const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Pindahkan route get by userId ke atas untuk menghindari konflik dengan route /:id
router.get('/user/:userId', wishlistController.getWishlistByUser); // Ubah path

// Route lainnya
router.post('/add', wishlistController.addToWishlist);
router.post('/', wishlistController.createWishlist);
router.get('/', wishlistController.getAllWishlists);
router.get('/:id', wishlistController.getWishlistById);
router.put('/:id', wishlistController.updateWishlist);
router.delete('/:id', wishlistController.deleteWishlist);

module.exports = router;
