'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    RegistrationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'Users',
    timestamps: false,
  });

  User.associate = function(models) {
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
  };

  return User;
};