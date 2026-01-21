'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ActivityLogs', {
            LogID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            Action: {
                type: Sequelize.STRING,
                allowNull: false
            },
            Description: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            EntityName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            EntityID: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ActivityLogs');
    }
};
