'use strict';

const { Payment } = require('../models');

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const [updated] = await Payment.update(req.body, {
      where: { PaymentID: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    const updatedPayment = await Payment.findByPk(req.params.id);
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.destroy({
      where: { PaymentID: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
