'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.OrderItem, {
        foreignKey: 'ProductID',
        as: 'OrderItems',
      });

      Product.hasMany(models.Wishlist, {
        foreignKey: 'ProductID',
        as: 'Wishlists',
      });

      Product.belongsTo(models.Supplier, {
        foreignKey: 'SupplierID',
        as: 'Supplier',
      });
    }
  }

  Product.init(
    {
      ProductName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      StockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      SupplierID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      timestamps: false,
    }
  );

  return Product;
};
