const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const transactionController = require('../controllers/transactionController');
const financialReportController = require('../controllers/financialReportController');
const supplierController = require('../controllers/supplierController');

// Dashboard stats endpoints
router.get('/stats/total-sales', isAdmin, async (req, res) => {
  try {
    const total = await transactionController.getTotalSales();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
router.post('/products', isAdmin, upload.single('image'), productController.createProduct);
router.get('/products/:id', isAdmin, productController.getProductById);
router.put('/products/:id', isAdmin, upload.single('image'), productController.updateProduct);
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
