'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Order, {
        foreignKey: 'OrderID',
        as: 'Order',
      });

      Transaction.hasOne(models.Payment, {
        foreignKey: 'TransactionID',
        as: 'Payment',
      });
    }
  }

  Transaction.init(
    {
      OrderID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      PaymentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TransactionDate: {
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
      modelName: 'Transaction',
      tableName: 'Transactions',
      timestamps: false,
    }
  );

  return Transaction;
};
