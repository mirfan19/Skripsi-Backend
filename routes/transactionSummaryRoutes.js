const express = require('express');
const router = express.Router();
const transactionSummaryController = require('../controllers/transactionSummaryController');

router.post('/', transactionSummaryController.createTransactionSummary);
router.get('/', transactionSummaryController.getAllTransactionSummaries);
router.get('/:id', transactionSummaryController.getTransactionSummaryById);
router.put('/:id', transactionSummaryController.updateTransactionSummary);
router.delete('/:id', transactionSummaryController.deleteTransactionSummary);

module.exports = router;