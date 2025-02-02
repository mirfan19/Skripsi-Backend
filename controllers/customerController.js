'use strict';

const { Customer } = require('../models');
const bcrypt = require('bcryptjs');

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { Username, Password, Email, Phone } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const customer = await Customer.create({
      Username,
      Password: hashedPassword,
      Email,
      Phone
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const { Username, Password, Email, Phone } = req.body;
    const hashedPassword = Password ? await bcrypt.hash(Password, 10) : undefined;
    const [updated] = await Customer.update(
      {
        Username,
        Password: hashedPassword,
        Email,
        Phone
      },
      {
        where: { id: req.params.id },
        individualHooks: true
      }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    const updatedCustomer = await Customer.findByPk(req.params.id);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};