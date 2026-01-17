'use strict';

const { Supplier } = require('../models');

exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {

    const suppliers = await Supplier.findAll();

    res.status(200).json(suppliers);
  } catch (error) {
    console.error('getAllSuppliers: Error occurred:', error);
    console.error('getAllSuppliers: Error message:', error.message);
    console.error('getAllSuppliers: Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to fetch suppliers'
    });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const [updated] = await Supplier.update(req.body, {
      where: { SupplierID: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    const updatedSupplier = await Supplier.findByPk(req.params.id);
    res.status(200).json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const deleted = await Supplier.destroy({
      where: { SupplierID: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
