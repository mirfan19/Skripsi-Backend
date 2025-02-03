'use strict';

const { Admin, Product } = require('../models');
const bcrypt = require('bcryptjs');

// Create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { Username, Password, Email, Phone, Role } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const admin = await Admin.create({
      Username,
      Password: hashedPassword,
      Email,
      Phone,
      Role
    });
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find a single admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an admin by ID
exports.updateAdmin = async (req, res) => {
  try {
    const { Username, Password, Email, Phone, Role } = req.body;
    const hashedPassword = Password ? await bcrypt.hash(Password, 10) : undefined;
    const [updated] = await Admin.update(
      {
        Username,
        Password: hashedPassword,
        Email,
        Phone,
        Role
      },
      {
        where: { id: req.params.id },
        individualHooks: true
      }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    const updatedAdmin = await Admin.findByPk(req.params.id);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an admin by ID
exports.deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { ProductName, Description, Price, StockQuantity, SupplierID } = req.body;
    const product = await Product.create({
      ProductName,
      Description,
      Price,
      StockQuantity,
      SupplierID
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};