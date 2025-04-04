'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransactionSummary extends Model {
    static associate(models) {
      // Relasi Payment ke TransactionSummary (One-to-Many)
      TransactionSummary.belongsTo(models.Payment, {
        foreignKey: 'PaymentID',
        as: 'Payment',
      });

      // Relasi FinancialReport ke TransactionSummary (One-to-Many)
      TransactionSummary.belongsTo(models.FinancialReport, {
        foreignKey: 'ReportID',
        as: 'FinancialReport',
      });
    }
  }

  TransactionSummary.init(
    {
      SummaryID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PaymentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Payments',
          key: 'PaymentID',
        },
        onDelete: 'CASCADE', // Add CASCADE delete
        onUpdate: 'CASCADE', // Add CASCADE update
      },
      ReportID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'FinancialReport',
          key: 'ReportID',
        },
        onDelete: 'CASCADE', // Add CASCADE delete
        onUpdate: 'CASCADE', // Add CASCADE update
      },
      Amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      TransactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      TransactionType: {
        type: DataTypes.ENUM('Income', 'Expense'),
        allowNull: false,
      },
    },
    {
        sequelize,
        modelName: 'TransactionSummary',
        tableName: 'TransactionSummary',
        timestamps: false,
    }
  );

  return TransactionSummary;
};
