'use strict';

const { Payment, Order } = require('../models');
const db = require('../models');
const snap = require('../config/midtrans');

exports.createPayment = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { OrderID, PaymentMethod, Amount } = req.body;

    if (!OrderID || !PaymentMethod || !Amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Get order details
    const order = await Order.findByPk(OrderID);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Create payment record
    const payment = await Payment.create({
      OrderID,
      PaymentMethod,
      Amount: parseFloat(Amount),
      Status: "Pending",
      PaymentDate: new Date()
    }, { transaction: t });

    // If not cash on delivery, create Midtrans transaction
    if (PaymentMethod !== "bayar_ditempat") {
      try {
        const transactionDetails = {
          transaction_details: {
            order_id: `ORDER-${OrderID}-${Date.now()}`,
            gross_amount: parseInt(Amount)
          },
          credit_card: {
            secure: true
          },
          customer_details: {
            ...order.ShippingDetails
          },
          callbacks: {
            finish: `${process.env.FRONTEND_URL}/order-confirmation`
          }
        };

        const midtransToken = await snap.createTransaction(transactionDetails);

        // Update payment with Midtrans details
        await payment.update({
          PaymentToken: midtransToken.token,
          MidtransOrderID: transactionDetails.transaction_details.order_id
        }, { transaction: t });

        await t.commit();

        return res.status(201).json({
          success: true,
          data: {
            PaymentID: payment.PaymentID,
            token: midtransToken.token
          }
        });
      } catch (midtransError) {
        await t.rollback();
        console.error("Midtrans error:", midtransError);
        return res.status(500).json({
          success: false,
          message: "Failed to create payment token"
        });
      }
    }

    await t.commit();
    return res.status(201).json({
      success: true,
      data: {
        PaymentID: payment.PaymentID
      }
    });

  } catch (error) {
    await t.rollback();
    console.error("Payment creation error:", error);
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
