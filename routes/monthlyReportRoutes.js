const express = require('express');
const router = express.Router();
const monthlyReportController = require('../controllers/monthlyReportController');

// GET /monthlyReports
router.get('/', monthlyReportController.getAllMonthlyReports);

module.exports = router;
