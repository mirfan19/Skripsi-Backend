'use strict';

const { Transaction, Order } = require('../models');
const { Op } = require('sequelize');

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

exports.getTotalSales = async (req, res) => {
  try {
    // Pastikan field sesuai dengan database!
    const totalTransactions = await Transaction.sum('Amount');

    const totalOrders = await Order.sum('TotalAmount', {
      where: { Status: { [Op.in]: ['Selesai', 'success', 'Checked Out'] } }
    });

    const total = (totalTransactions || 0) + (totalOrders || 0);

    res.json({ total });
  } catch (error) {
    console.error(error); // Tambahkan log ini untuk cek error detail di terminal
    res.status(500).json({ message: error.message });
  }
};
