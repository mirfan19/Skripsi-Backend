'use strict';

const { Product, Supplier } = require('../models'); // Add Supplier to the imports
const { Op } = require('sequelize');

exports.createProduct = async (req, res) => {
  try {
    const { ProductName, Description, Price, StockQuantity, SupplierID } = req.body;

    const productData = {
      ProductName,
      Description,
      Price: parseFloat(Price),
      StockQuantity: parseInt(StockQuantity),
      SupplierID: parseInt(SupplierID),
      ImageURL: req.file ? `/uploads/product/${req.file.filename}` : null, // Set ImageURL
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { ProductName: { [Op.iLike]: `%${search}%` } },
          { Description: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const products = await Product.findAll({
      where: whereClause,
      attributes: ['ProductID', 'ProductName', 'Description', 'Price', 'StockQuantity', 'ImageURL'],
      order: [['ProductName', 'ASC']]
    });
    
    res.status(200).json({ 
      success: true,
      data: products 
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch products',
      message: error.message 
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { ProductName, Description, Price, StockQuantity, SupplierID } = req.body;

    const updateData = {
      ProductName,
      Description,
      Price: parseFloat(Price),
      StockQuantity: parseInt(StockQuantity),
      SupplierID: parseInt(SupplierID),
    };

    if (req.file) {
      updateData.ImageURL = `/uploads/product/${req.file.filename}`; // Update ImageURL
    }

    const [updated] = await Product.update(updateData, {
      where: { ProductID: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const updatedProduct = await Product.findByPk(req.params.id);
    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { ProductID: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductCatalog = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({
      where: { ProductID: id },
      include: [{
        model: Supplier,
        as: 'Supplier',
        attributes: ['SupplierID', 'SupplierName'] // Include SupplierID
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error getting product detail:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
