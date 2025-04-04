'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.hasMany(models.TransactionSummary, {
        foreignKey: 'PaymentID',
        as: 'TransactionSummaries',
      });
    }
  }

  Payment.init(
    {
      PaymentID: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Set PaymentID as the primary key
        autoIncrement: true, // Auto-increment for PaymentID
      },
      PaymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PaymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      Amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'Payments',
      timestamps: false,
    }
  );

  return Payment;
};
