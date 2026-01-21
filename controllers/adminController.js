'use strict';

const { Order, Product, User, ActivityLog, OrderItem, Transaction } = require('../models');
const { Op, fn, col } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Recent Activities (last 10)
        const recentActivities = await ActivityLog.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']]
        });

        // 2. Recent Orders (last 5)
        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['OrderDate', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['Username']
                }
            ]
        });

        // 3. Order Status Summary counts
        const statusCounts = await Order.findAll({
            attributes: ['Status', [fn('COUNT', col('Status')), 'count']],
            group: ['Status']
        });

        // 4. Products with low stock (< 10)
        const lowStockProducts = await Product.findAll({
            where: {
                StockQuantity: { [Op.lt]: 10 }
            },
            limit: 5,
            order: [['StockQuantity', 'ASC']]
        });

        // 5. Total Low Stock Count
        const lowStockCount = await Product.count({
            where: {
                StockQuantity: { [Op.lt]: 10 }
            }
        });

        // 6. Operational Insights: Top selling products (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const topSelling = await OrderItem.findAll({
            attributes: [
                'ProductID',
                [fn('SUM', col('Quantity')), 'totalQty']
            ],
            include: [
                {
                    model: Product,
                    as: 'Product',
                    attributes: ['ProductName']
                },
                {
                    model: Order,
                    as: 'Order',
                    attributes: [],
                    where: {
                        OrderDate: { [Op.gte]: thirtyDaysAgo }
                    }
                }
            ],
            group: ['OrderItem.ProductID', 'Product.ProductID', 'Product.ProductName'],
            order: [[fn('SUM', col('Quantity')), 'DESC']],
            limit: 5
        });

        // 7. New Customers Today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const newCustomersCount = await User.count({
            where: {
                createdAt: { [Op.gte]: startOfToday }
            }
        });

        // 8. Total Sales Calculation (replicated from transactionController)
        const totalTransactions = await Transaction.sum('Amount');
        const totalOrders = await Order.sum('TotalAmount', {
            where: { Status: { [Op.in]: ['Selesai', 'success', 'Checked Out', 'Paid'] } }
        });
        const totalSales = (totalTransactions || 0) + (totalOrders || 0);

        // 9. New Orders Count (Pending)
        const newOrdersCount = await Order.count({
            where: { Status: 'Pending' }
        });

        res.status(200).json({
            success: true,
            data: {
                recentActivities,
                recentOrders,
                statusCounts,
                lowStockProducts,
                topSelling,
                stats: {
                    totalSales,
                    newOrdersCount,
                    lowStockCount
                },
                insights: {
                    newCustomersCount
                }
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
};
