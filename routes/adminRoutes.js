const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/adminMiddleware');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const transactionController = require('../controllers/transactionController');
const financialReportController = require('../controllers/financialReportController');

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
router.post('/products', isAdmin, productController.createProduct);
router.put('/products/:id', isAdmin, productController.updateProduct);
router.delete('/products/:id', isAdmin, productController.deleteProduct);

// Order management
router.get('/orders', isAdmin, orderController.getAllOrders);
router.put('/orders/:id', isAdmin, orderController.updateOrder);

// Financial reports
router.get('/financial-reports', isAdmin, financialReportController.getAllFinancialReports);
router.post('/financial-reports', isAdmin, financialReportController.createFinancialReport);

module.exports = router;
