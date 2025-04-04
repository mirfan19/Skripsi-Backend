'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Connect User to Orders
      User.hasMany(models.Order, {
        foreignKey: 'UserID', // Use UserID as the foreign key
        as: 'Orders',
      });

      // Connect User to Wishlists
      User.hasMany(models.Wishlist, {
        foreignKey: 'UserID', // Use UserID as the foreign key
        as: 'Wishlists',
      });
    }
  }

  User.init(
    {
      UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Set UserID as the primary key
        autoIncrement: true, // Auto-increment for UserID
      },
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
        type: DataTypes.STRING, // Role remains a string
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