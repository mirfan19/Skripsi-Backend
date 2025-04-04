'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.ActivityLog, {
        foreignKey: 'AdminID',
        as: 'ActivityLogs',
      });

      User.hasMany(models.Order, {
        foreignKey: 'CustomerID',
        as: 'Orders',
      });

      User.hasMany(models.Wishlist, {
        foreignKey: 'CustomerID',
        as: 'Wishlists',
      });
    }
  }

  User.init(
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
      Role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      RegistrationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: false,
    }
  );

  return User;
};