// customerController.js
const express = require('express');
const router = express.Router();

// Mock database for demonstration purposes
let customers = [];
let currentId = 1;

// Create a new customer
exports.create = (req, res) => {
    if (!req.body.name) {
        return res.status(400).send({ message: "Name cannot be empty" });
    }

    const customer = {
        id: currentId++,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    };

    customers.push(customer);
    res.status(201).send(customer);
};

// Retrieve all customers
exports.findAll = (req, res) => {
    res.status(200).send(customers);
};

// Find a single customer by ID
exports.findOne = (req, res) => {
    const customerId = parseInt(req.params.id, 10);
    const customer = customers.find(c => c.id === customerId);

    if (!customer) {
        return res.status(404).send({ message: "Customer not found with id " + req.params.id });
    }

    res.status(200).send(customer);
};

// Update a customer by ID
exports.update = (req, res) => {
    const customerId = parseInt(req.params.id, 10);
    const customerIndex = customers.findIndex(c => c.id === customerId);

    if (customerIndex === -1) {
        return res.status(404).send({ message: "Customer not found with id " + req.params.id });
    }

    if (!req.body.name) {
        return res.status(400).send({ message: "Name cannot be empty" });
    }

    customers[customerIndex] = {
        id: customerId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    };

    res.status(200).send(customers[customerIndex]);
};

// Delete a customer by ID
exports.delete = (req, res) => {
    const customerId = parseInt(req.params.id, 10);
    const customerIndex = customers.findIndex(c => c.id === customerId);

    if (customerIndex === -1) {
        return res.status(404).send({ message: "Customer not found with id " + req.params.id });
    }

    customers.splice(customerIndex, 1);
    res.status(200).send({ message: "Customer deleted successfully" });
};
