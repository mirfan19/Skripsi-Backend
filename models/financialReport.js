'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FinancialReport extends Model {
    static associate(models) {
      // Relasi FinancialReport ke TransactionSummary (One-to-Many)
      FinancialReport.hasMany(models.TransactionSummary, {
        foreignKey: 'ReportID',
        as: 'TransactionSummaries',
      });
    }
  }

  FinancialReport.init(
    {
      ReportID: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Set ReportID as the primary key
        autoIncrement: true, // Auto-increment for ReportID
      },
      income: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      expenses: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      gross_revenue: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      net_revenue: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'FinancialReport',
      tableName: 'FinancialReport',
      timestamps: false, // Disable timestamps
    }
  );

  return FinancialReport;
};
