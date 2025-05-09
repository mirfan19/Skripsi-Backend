'use strict';

const { Order, OrderItem, Product, Cart } = require('../models');
const db = require('../models');

// Create a new order
exports.createOrder = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { userId, items, shippingDetails } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.Product.Price * item.Quantity);
    }, 0);

    // Create order
    const order = await Order.create({
      UserID: userId,
      TotalAmount: totalAmount,
      Status: 'Pending',
      ShippingAddress: shippingDetails.address,
      ShippingDetails: shippingDetails,
      OrderDate: new Date()
    }, { transaction: t });

    // Create order items
    await Promise.all(items.map(item => {
      return OrderItem.create({
        OrderID: order.OrderID,
        ProductID: item.ProductID,
        Quantity: item.Quantity,
        Price: item.Product.Price
      }, { transaction: t });
    }));

    // Clear cart
    await Cart.destroy({
      where: { UserID: userId },
      transaction: t
    });

    await t.commit();

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add item to order
exports.addItemToOrder = async (req, res) => {
  try {
    const { OrderID, ProductID, Quantity } = req.body;
    const product = await Product.findByPk(ProductID);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const orderItem = await OrderItem.create({
      OrderID,
      ProductID,
      Quantity,
      Price: product.Price
    });
    res.status(201).json(orderItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Checkout order
exports.checkoutOrder = async (req, res) => {
  try {
    const { OrderID } = req.body;
    const order = await Order.findByPk(OrderID);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.Status = 'Checked Out';
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// View order status
exports.getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ status: order.Status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View order history
exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { CustomerID: req.params.customerId } });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  try {
    const [updated] = await Order.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const updatedOrder = await Order.findByPk(req.params.id);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
