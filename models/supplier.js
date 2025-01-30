'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      Supplier.hasMany(models.Product, {
        foreignKey: 'SupplierID',
        as: 'Products',
      });
    }
  }

  Supplier.init(
    {
      SupplierName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ContactName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Phone: {
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
      Address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Supplier',
      tableName: 'Suppliers',
      timestamps: false,
    }
  );

  return Supplier;
};
