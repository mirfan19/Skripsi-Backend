'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Transaction, {
        foreignKey: 'TransactionID',
        as: 'Transaction',
      });
    }
  }

  Payment.init(
    {
      PaymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PaymentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      Amount: {
        type: DataTypes.DECIMAL(10, 2),
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
