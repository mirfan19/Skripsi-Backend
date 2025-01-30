'use strict';

const { OrderItem } = require('../models');

exports.createOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.create(req.body);
    res.status(201).json(orderItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (!orderItem) {
      return res.status(404).json({ error: 'Order Item not found' });
    }
    res.status(200).json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const [updated] = await OrderItem.update(req.body, {
      where: { OrderItemID: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Order Item not found' });
    }
    const updatedOrderItem = await OrderItem.findByPk(req.params.id);
    res.status(200).json(updatedOrderItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const deleted = await OrderItem.destroy({
      where: { OrderItemID: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Order Item not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
