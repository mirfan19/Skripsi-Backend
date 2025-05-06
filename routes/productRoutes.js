const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');

// Protected routes with file upload
router.post('/', upload.single('image'), productController.createProduct);
router.put('/:id', upload.single('image'), productController.updateProduct);

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/detail/:id', productController.getProductDetail);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
