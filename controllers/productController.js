'use strict';

const { Product, Supplier } = require('../models'); // Add Supplier to the imports
const { Op } = require('sequelize');

exports.createProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { ProductName, Description, Price, StockQuantity, Category, SupplierID } = req.body;

    if (!ProductName || !Description || !Price || !StockQuantity || !SupplierID) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }
    console.log('nih supplier id', SupplierID);
    const productData = {
      ProductName,
      Description,
      Price: parseFloat(Price),
      StockQuantity: parseInt(StockQuantity),
      Category,
      SupplierID: parseInt(SupplierID),
      ImageURL: req.file ? `/uploads/product/${req.file.filename}` : null
    };

    console.log('Creating product with data:', productData);

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
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
    console.log('Updating product with ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    // Validate required fields
    const { ProductName, Description, Price, StockQuantity, SupplierID } = req.body;
    
    if (!ProductName || !Description || !Price || !StockQuantity || !SupplierID) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Validate numeric fields
    const price = parseFloat(Price);
    const stockQuantity = parseInt(StockQuantity);
    const supplierId = parseInt(SupplierID);

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price value'
      });
    }

    if (isNaN(stockQuantity) || stockQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock quantity value'
      });
    }

    const updateData = {
      ProductName,
      Description,
      Price: price,
      StockQuantity: stockQuantity,
      SupplierID: supplierId
    };

    if (req.file) {
      updateData.ImageURL = `/uploads/product/${req.file.filename}`;
      console.log('New image path:', updateData.ImageURL);
    }

    console.log('Update data:', updateData);

    // First check if product exists
    const existingProduct = await Product.findByPk(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update the product
    await Product.update(updateData, {
      where: { ProductID: req.params.id }
    });

    // Fetch updated product
    const updatedProduct = await Product.findByPk(req.params.id);
    console.log('Product updated successfully:', updatedProduct);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the product',
      error: error.message
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

// Low stock threshold
const LOW_STOCK_THRESHOLD = 10;

exports.getLowStockCount = async () => {
  try {
    const count = await Product.count({
      where: {
        StockQuantity: { [Op.lt]: LOW_STOCK_THRESHOLD }
      }
    });
    return count;
  } catch (error) {
    console.error('Error getting low stock count:', error);
    throw error;
  }
};

exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    const product = await Product.findOne({
      where: { ProductID: barcode }, // For now, using ProductID as barcode
      attributes: ['ProductID', 'ProductName', 'Description', 'Price', 'StockQuantity']
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: product.ProductID,
        name: product.ProductName,
        price: product.Price,
        stock: product.StockQuantity
      }
    });
  } catch (error) {
    console.error('Error getting product by barcode:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
