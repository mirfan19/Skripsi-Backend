'use strict';

const { Cart, Product } = require('../models');

exports.addToCart = async (req, res) => {
  try {
    const { UserID, ProductID, Quantity } = req.body;

    // Check product stock first
    const product = await Product.findByPk(ProductID);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.StockQuantity < Quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }

    // Check if item already exists in cart
    let cartItem = await Cart.findOne({
      where: { UserID, ProductID }
    });

    if (cartItem) {
      // Update quantity if item exists
      const newQuantity = cartItem.Quantity + parseInt(Quantity);
      if (newQuantity > product.StockQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add more items than available in stock'
        });
      }
      cartItem.Quantity = newQuantity;
      await cartItem.save();
    } else {
      // Create new cart item if it doesn't exist
      cartItem = await Cart.create({
        UserID,
        ProductID,
        Quantity
      });
    }

    res.status(200).json({
      success: true,
      data: cartItem
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.findAll({
      where: { UserID: userId },
      include: [{
        model: Product,
        as: 'Product',
        attributes: ['ProductID', 'ProductName', 'Price', 'ImageURL', 'StockQuantity']
      }]
    });

    res.status(200).json({
      success: true,
      data: cartItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { Quantity } = req.body;

    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    cartItem.Quantity = Quantity;
    await cartItem.save();

    res.status(200).json({
      success: true,
      data: cartItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    
    const deleted = await Cart.destroy({
      where: { CartID: cartId }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};