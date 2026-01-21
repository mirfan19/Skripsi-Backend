'use strict';


const { Product, Supplier, ActivityLog } = require('../models'); // Add Supplier and ActivityLog to the imports
const { Op } = require('sequelize');

exports.createProduct = async (req, res) => {
  try {



    const { ProductName, Description, Price, StockQuantity, Category, SupplierID } = req.body;

    if (!ProductName || !Description || !Price || !StockQuantity || !SupplierID) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const productData = {
      ProductName,
      Description,
      Price: parseFloat(Price),
      StockQuantity: parseInt(StockQuantity),
      Category,
      SupplierID: parseInt(SupplierID),
      ImageURL: req.file ? `/uploads/product/${req.file.filename}` : null
    };



    const product = await Product.create(productData);

    // Log Activity
    try {
      await ActivityLog.create({
        Action: 'ADD_PRODUCT',
        Description: `Produk baru ditambahkan: ${product.ProductName}`,
        EntityName: 'Product',
        EntityID: product.ProductID
      });
    } catch (logError) {
      console.error('Failed to create activity log:', logError);
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
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
    console.error('Error in getAllProducts:', error.message);
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
    console.error('getProductById: Error occurred:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      error: 'Failed to fetch product details'
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {


    // Validate required fields
    const { ProductName, Description, Price, StockQuantity, SupplierID, Category } = req.body;

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

    if (isNaN(supplierId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid SupplierID'
      });
    }

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

    // Check if supplier exists
    let supplier;
    try {
      if (!Supplier) throw new Error('Supplier model is not loaded!');
      supplier = await Supplier.findByPk(supplierId);
    } catch (err) {
      console.error('Error checking supplier:', err);
      throw new Error(`Supplier check failed: ${err.message}`);
    }

    if (!supplier) {
      return res.status(400).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    const updateData = {
      ProductName,
      Description,
      Price: price,
      StockQuantity: stockQuantity,
      SupplierID: supplierId,
      Category: Category || 'Lainnya'
    };

    if (req.file) {
      updateData.ImageURL = `/uploads/product/${req.file.filename}`;
    }



    // First check if product exists
    const existingProduct = await Product.findByPk(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update the product
    try {
      await Product.update(updateData, {
        where: { ProductID: req.params.id }
      });
    } catch (err) {
      console.error('Error in Product.update:', err);
      throw err; // Re-throw to be caught by main handler
    }

    // Fetch updated product
    const updatedProduct = await Product.findByPk(req.params.id);

    // Log Activity
    try {
      await ActivityLog.create({
        Action: 'UPDATE_PRODUCT',
        Description: `Produk diperbarui: ${updatedProduct.ProductName}`,
        EntityName: 'Product',
        EntityID: updatedProduct.ProductID
      });
    } catch (logError) {
      console.error('Failed to create activity log:', logError);
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error.message);

    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the product',
      error: error.message,
      details: error.name // Send error name to frontend for easier identification
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    // Fetch product name for logging BEFORE deletion
    const product = await Product.findByPk(req.params.id);
    const productName = product ? product.ProductName : req.params.id;

    const deleted = await Product.destroy({
      where: { ProductID: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    try {
      await ActivityLog.create({
        Action: 'DELETE_PRODUCT',
        Description: `Produk dihapus: ${productName}`,
        EntityName: 'Product',
        EntityID: req.params.id
      });
    } catch (logError) {
      console.error('Failed to create activity log:', logError);
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error.message);

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      let message = 'Cannot delete product because it is referenced in other records.';

      // Check specific tables based on constraints
      // error.parent.table is available in Postgres
      const table = error.parent && error.parent.table;

      if (table === 'Carts' || error.index === 'Carts_ProductID_fkey') {
        message = 'Cannot delete this product because it is currently in a Customer Cart. Please ask users to remove it or delete the cart data first.';
      } else if (table === 'OrderItems' || table === 'Orders' || error.index === 'OrderItems_ProductID_fkey') {
        message = 'Cannot delete this product because it is part of a simplified Order history.';
      }

      return res.status(409).json({
        success: false,
        message: message,
        error: 'Foreign Key Constraint Violation'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
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
    console.error('Error getting product detail:', error.message);
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
