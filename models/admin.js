'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      Admin.hasMany(models.ActivityLog, {
        foreignKey: 'AdminID',
        as: 'ActivityLogs',
      });
    }
  }

  Admin.init(
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
      RegistrationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Admin',
      tableName: 'Admins',
      timestamps: false,
    }
  );

  return Admin;
};
