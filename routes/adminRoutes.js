const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Create a new admin
router.post('/', adminController.createAdmin);

// Retrieve all admins
router.get('/', adminController.getAllAdmins);

// Find a single admin by ID
router.get('/:id', adminController.getAdminById);

// Update an admin by ID
router.put('/:id', adminController.updateAdmin);

// Delete an admin by ID
router.delete('/:id', adminController.deleteAdmin);

// Create a new product
router.post('/products', adminController.createProduct);

// Manage stock
router.put('/products/stock', adminController.manageStock);

// Manage transactions
router.get('/transactions', adminController.manageTransactions);

// Manage customers
router.get('/customers', adminController.manageCustomers);

// Sales report
router.get('/sales-report', adminController.salesReport);

// Manage payments
router.get('/payments', adminController.managePayments);

// Manage suppliers
router.get('/suppliers', adminController.manageSuppliers);

// Manage activity logs
router.get('/activity-logs', adminController.manageActivityLogs);

module.exports = router;