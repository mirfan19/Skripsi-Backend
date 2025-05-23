'use strict';

const { Transaction } = require('../models');
const { Sequelize } = require('sequelize');

exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const [updated] = await Transaction.update(req.body, {
      where: { TransactionID: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    const updatedTransaction = await Transaction.findByPk(req.params.id);
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: { TransactionID: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTotalSales = async () => {
  try {
    const result = await Transaction.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('Amount')), 'totalSales']
      ]
    });
    return result[0]?.get('totalSales') || 0;
  } catch (error) {
    console.error('Error getting total sales:', error);
    throw error;
  }
};
