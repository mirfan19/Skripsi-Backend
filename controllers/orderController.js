'use strict';

const { Order, OrderItem, Product, Cart } = require('../models');
const db = require('../models');

// Create a new order
exports.createOrder = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { UserID, OrderItems, ShippingDetails, TotalAmount } = req.body;

    if (!UserID || !TotalAmount || !ShippingDetails) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const order = await Order.create({
      UserID,
      ShippingDetails,
      TotalAmount,
      Status: "Pending",
      OrderDate: new Date(),
    }, { transaction: t });

    // Use OrderItemID instead of id
    if (OrderItems && OrderItems.length > 0) {
      await OrderItem.bulkCreate(
        OrderItems.map(item => ({
          OrderID: order.OrderID,
          ProductID: item.ProductID,
          Quantity: item.Quantity,
          Price: item.Price
        })),
        { transaction: t }
      );
    }

    await t.commit();

    res.status(201).json({
      success: true,
      data: { 
        orderId: order.OrderID,
        totalAmount: order.TotalAmount,
        status: order.Status
      }
    });
  } catch (error) {
    await t.rollback();
    console.error("Order creation error:", error);
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
      OrderID, // Use OrderID as the foreign key
      ProductID,
      Quantity,
      Price: product.Price,
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
    const order = await Order.findByPk(OrderID); // Use OrderID as the primary key
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
    const order = await Order.findByPk(req.params.OrderID); // Use OrderID in params
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
    const orders = await Order.findAll({ where: { UserID: req.params.UserID } }); // Use UserID for filtering
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

// Find a single order by OrderID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.OrderID); // Use OrderID in params
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order by OrderID
exports.updateOrder = async (req, res) => {
  try {
    const [updated] = await Order.update(req.body, {
      where: { OrderID: req.params.OrderID }, // Use OrderID in params
    });
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const updatedOrder = await Order.findByPk(req.params.OrderID); // Use OrderID in params
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an order by OrderID
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.destroy({
      where: { OrderID: req.params.OrderID }, // Use OrderID in params
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
