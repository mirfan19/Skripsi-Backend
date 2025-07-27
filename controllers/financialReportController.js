const { Transaction } = require('../models');
const { Sequelize } = require('sequelize');
// GET /admin/financial-report/monthly
exports.getMonthlyIncome = async (req, res) => {
  // Dummy data for testing
  return res.json({
    success: true,
    data: [
      { month: '2025-01', income: 1000000 },
      { month: '2025-02', income: 1200000 },
      { month: '2025-03', income: 900000 },
      { month: '2025-04', income: 1500000 },
      { month: '2025-05', income: 1100000 },
      { month: '2025-06', income: 1700000 },
      { month: '2025-07', income: 1300000 }
    ]
  });
};
'use strict';

const { FinancialReport } = require('../models');

// Create a new FinancialReport
exports.createFinancialReport = async (req, res) => {
  try {
    const financialReport = await FinancialReport.create(req.body);
    res.status(201).json(financialReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve all FinancialReports
exports.getAllFinancialReports = async (req, res) => {
  try {
    const financialReports = await FinancialReport.findAll();
    res.status(200).json(financialReports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve a single FinancialReport by ID
exports.getFinancialReportById = async (req, res) => {
  try {
    const financialReport = await FinancialReport.findByPk(req.params.id);
    if (!financialReport) {
      return res.status(404).json({ error: 'FinancialReport not found' });
    }
    res.status(200).json(financialReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a FinancialReport by ID
exports.updateFinancialReport = async (req, res) => {
  try {
    const [updated] = await FinancialReport.update(req.body, {
      where: { ReportID: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'FinancialReport not found' });
    }
    const updatedFinancialReport = await FinancialReport.findByPk(req.params.id);
    res.status(200).json(updatedFinancialReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a FinancialReport by ID
exports.deleteFinancialReport = async (req, res) => {
  try {
    const deleted = await FinancialReport.destroy({
      where: { ReportID: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'FinancialReport not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};