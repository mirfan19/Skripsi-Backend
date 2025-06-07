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

// Get all orders with user details
exports.getAllOrders = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};
      if (search) {
      whereClause = {
        [db.Sequelize.Op.or]: [
          { '$User.Username$': { [db.Sequelize.Op.like]: `%${search}%` } },
          { OrderID: { [db.Sequelize.Op.eq]: search } }
        ]
      };
    }const orders = await Order.findAll({
      include: [
        {
          model: db.User,
          as: 'User', // Added the alias here
          attributes: ['Username']
        }
      ],
      where: whereClause,
      order: [['OrderDate', 'DESC']]
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving orders',
      error: error.message 
    });
  }
};

// Get order details by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          attributes: ['Username', 'Email', 'Phone']
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ['ProductName', 'Price']
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving order details',
      error: error.message
    });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.OrderID;

    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update the order status
    await order.update({ Status: status });

    // Get the updated order with user information
    const updatedOrder = await Order.findByPk(orderId, {
      include: [
        {
          model: db.User,
          attributes: ['Username']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
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

exports.getNewOrdersCount = async () => {
  try {
    const count = await Order.count({
      where: { Status: 'Pending' }
    });
    return count;
  } catch (error) {
    console.error('Error getting new orders count:', error);
    throw error;
  }
};
