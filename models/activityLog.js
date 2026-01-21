'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ActivityLog extends Model {
        static associate(models) {
            // Define association here if needed
        }
    }

    ActivityLog.init(
        {
            LogID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            Action: {
                type: DataTypes.STRING, // e.g., 'CREATE_ORDER', 'UPDATE_STOCK', 'ADD_PRODUCT'
                allowNull: false,
            },
            Description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            EntityName: {
                type: DataTypes.STRING, // e.g., 'Order', 'Product'
                allowNull: true,
            },
            EntityID: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'ActivityLog',
            tableName: 'ActivityLogs',
            timestamps: true,
        }
    );

    return ActivityLog;
};
