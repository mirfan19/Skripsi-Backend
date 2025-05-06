'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: 'UserID',
        as: 'User'
      });
      Cart.belongsTo(models.Product, {
        foreignKey: 'ProductID',
        as: 'Product'
      });
    }
  }

  Cart.init({
    CartID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts',
    timestamps: true
  });

  return Cart;
};