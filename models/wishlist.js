'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      Wishlist.belongsTo(models.User, {
        foreignKey: 'UserID',
        as: 'User',
      });

      Wishlist.belongsTo(models.Product, {
        foreignKey: 'ProductID',
        as: 'Product',
      });
    }
  }

  Wishlist.init(
    {
      WishlistID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
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
