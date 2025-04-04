'use strict';

const { TransactionSummary } = require('../models');

// Create a new TransactionSummary
exports.createTransactionSummary = async (req, res) => {
  try {
    const transactionSummary = await TransactionSummary.create(req.body);
    res.status(201).json(transactionSummary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve all TransactionSummaries
exports.getAllTransactionSummaries = async (req, res) => {
  try {
    const transactionSummaries = await TransactionSummary.findAll();
    res.status(200).json(transactionSummaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve a single TransactionSummary by ID
exports.getTransactionSummaryById = async (req, res) => {
  try {
    const transactionSummary = await TransactionSummary.findByPk(req.params.id);
    if (!transactionSummary) {
      return res.status(404).json({ error: 'TransactionSummary not found' });
    }
    res.status(200).json(transactionSummary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a TransactionSummary by ID
exports.updateTransactionSummary = async (req, res) => {
  try {
    const [updated] = await TransactionSummary.update(req.body, {
      where: { SummaryID: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'TransactionSummary not found' });
    }
    const updatedTransactionSummary = await TransactionSummary.findByPk(req.params.id);
    res.status(200).json(updatedTransactionSummary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a TransactionSummary by ID
exports.deleteTransactionSummary = async (req, res) => {
  try {
    const deleted = await TransactionSummary.destroy({
      where: { SummaryID: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'TransactionSummary not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};