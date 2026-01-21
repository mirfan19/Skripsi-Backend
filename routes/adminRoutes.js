const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const transactionController = require('../controllers/transactionController');
const financialReportController = require('../controllers/financialReportController');
const supplierController = require('../controllers/supplierController');
const adminController = require('../controllers/adminController');



// Dashboard stats endpoints
router.get('/dashboard/stats', isAdmin, adminController.getDashboardStats);
router.get('/stats/total-sales', isAdmin, transactionController.getTotalSales);

router.get('/stats/new-orders', isAdmin, async (req, res) => {
  try {
    const count = await orderController.getNewOrdersCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/low-stock', isAdmin, async (req, res) => {
  try {
    const count = await productController.getLowStockCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Product management
router.get('/products', isAdmin, productController.getAllProducts);
router.post('/products', isAdmin, (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('Multer upload error:', err.message);
      return res.status(400).json({
        success: false,
        message: 'File upload error',
        error: err.message
      });
    }
    next();
  });
}, productController.createProduct);
router.get('/products/:id', isAdmin, productController.getProductById);
router.put('/products/:id', isAdmin, (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('Multer upload error:', err.message);
      return res.status(400).json({
        success: false,
        message: 'File upload error',
        error: err.message
      });
    }
    next();
  });
}, productController.updateProduct);
router.delete('/products/:id', isAdmin, productController.deleteProduct);

// Order management
router.get('/orders', isAdmin, orderController.getAllOrders);
router.put('/orders/:id', isAdmin, orderController.updateOrder);

// Financial reports
router.get('/financial-reports', isAdmin, financialReportController.getAllFinancialReports);
router.post('/financial-reports', isAdmin, financialReportController.createFinancialReport);

// Supplier management
router.get('/suppliers', isAdmin, supplierController.getAllSuppliers);

module.exports = router;
