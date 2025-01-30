'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Order, {
        foreignKey: 'CustomerID',
        as: 'Orders',
      });

      Customer.hasMany(models.Wishlist, {
        foreignKey: 'CustomerID',
        as: 'Wishlists',
      });
    }
  }

  Customer.init(
    {
      Username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      Phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      RegistrationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Customer',
      tableName: 'Customers',
      timestamps: false,
    }
  );

  return Customer;
};
