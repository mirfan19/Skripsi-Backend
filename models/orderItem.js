'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'OrderID',
        as: 'Order',
      });

      OrderItem.belongsTo(models.Product, {
        foreignKey: 'ProductID',
        as: 'Product',
      });
    }
  }

  OrderItem.init(
    {
      OrderID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ProductID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'OrderItems',
      timestamps: false,
    }
  );

  return OrderItem;
};
