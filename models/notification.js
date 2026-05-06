'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'UserID', as: 'User' });
      Notification.belongsTo(models.Product, { foreignKey: 'ProductID', as: 'Product' });
    }
  }
  Notification.init({
    NotificationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: DataTypes.INTEGER,
    ProductID: DataTypes.INTEGER,
    Message: DataTypes.TEXT,
    Type: DataTypes.STRING,
    IsRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'Notifications',
  });
  return Notification;
};