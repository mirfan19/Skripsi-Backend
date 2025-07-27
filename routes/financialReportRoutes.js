const express = require('express');
const router = express.Router();

const financialReportController = require('../controllers/financialReportController');
// Monthly income report for chart
router.get('/monthly', financialReportController.getMonthlyIncome);

router.post('/', financialReportController.createFinancialReport);
router.get('/', financialReportController.getAllFinancialReports);
router.get('/:id', financialReportController.getFinancialReportById);
router.put('/:id', financialReportController.updateFinancialReport);
router.delete('/:id', financialReportController.deleteFinancialReport);

module.exports = router;