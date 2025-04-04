'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    static associate(models) {
      ActivityLog.belongsTo(models.User, { foreignKey: 'AdminID', as: 'Admin' });
    }
  }

  ActivityLog.init(
    {
      AdminID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ActivityDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ActivityDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ActivityLog',
      tableName: 'ActivityLogs',
      timestamps: false,
    }
  );

  return ActivityLog;
};
