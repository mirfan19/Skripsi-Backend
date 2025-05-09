'use strict';

const { Payment, Order } = require('../models');
const db = require('../models');

exports.createPayment = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { OrderID, PaymentMethod, Amount, Status } = req.body;

    // Create payment record
    const payment = await Payment.create({
      OrderID,
      PaymentMethod,
      Amount,
      Status,
      PaymentDate: new Date()
    }, { transaction: t });

    // Update order status
    await Order.update({
      Status: 'Paid',
      PaymentID: payment.PaymentID
    }, {
      where: { OrderID },
      transaction: t
    });

    await t.commit();

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
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

exports.getPaymentByOrderId = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { OrderID: req.params.orderId }
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
