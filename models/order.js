'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'UserID',
        as: 'User',
      });

      Order.hasMany(models.OrderItem, {
        foreignKey: 'OrderID',
        as: 'OrderItems',
      });

      Order.hasOne(models.Transaction, {
        foreignKey: 'OrderID',
        as: 'Transaction',
      });
    }
  }

  Order.init(
    {
      CustomerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      OrderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      TotalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      Status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders',
      timestamps: false,
    }
  );

  return Order;
};
