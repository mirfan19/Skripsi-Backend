'use strict';

const { User, Product, Order, Wishlist, ActivityLog, Transaction, Payment, Supplier } = require('../models');
const bcrypt = require('bcryptjs');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { Username, Password, Email, Phone, Role, Address } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = await User.create({
      Username,
      Password: hashedPassword,
      Email,
      Phone,
      Role,
      Address,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { Username, Password, Email, Phone, Role, Address } = req.body;
    const hashedPassword = Password ? await bcrypt.hash(Password, 10) : undefined;
    const [updated] = await User.update(
      {
        Username,
        Password: hashedPassword,
        Email,
        Phone,
        Role,
        Address,
      },
      {
        where: { id: req.params.id },
        individualHooks: true,
      }
    );
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updatedUser = await User.findByPk(req.params.id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};