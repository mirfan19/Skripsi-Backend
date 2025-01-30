'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      Wishlist.belongsTo(models.Customer, {
        foreignKey: 'CustomerID',
        as: 'Customer',
      });

      Wishlist.belongsTo(models.Product, {
        foreignKey: 'ProductID',
        as: 'Product',
      });
    }
  }

  Wishlist.init(
    {
      CustomerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ProductID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      AddedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Wishlist',
      tableName: 'Wishlists',
      timestamps: false,
    }
  );

  return Wishlist;
};
