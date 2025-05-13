'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order, {
        foreignKey: 'OrderID',
        as: 'Order'
      });
      
      Payment.hasOne(models.TransactionSummary, {
        foreignKey: 'PaymentID',
        as: 'TransactionSummary'
      });

      Payment.belongsTo(models.Transaction, {
        foreignKey: 'TransactionID',
        as: 'Transaction'
      });
    }
  }
  Payment.init({
    PaymentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    TransactionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Transactions',
        key: 'TransactionID'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    OrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'OrderID'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    PaymentMethod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pending'
    },
    PaymentToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    MidtransOrderID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PaymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments',
    timestamps: true
  });

  return Payment;
};
