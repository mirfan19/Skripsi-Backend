const cron = require('node-cron');
const { Product, Wishlist, Notification } = require('../models');
const { Op } = require('sequelize');

const startCronJobs = () => {
  // Run every minute for testing (ubah kembali menjadi '0 * * * *' setelah selesai tes)
  cron.schedule('* * * * *', async () => {
    console.log('Running smart notification cron job...');
    try {
      const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60 * 1000);

      // 1. Check for Price Drops
      const priceDroppedProducts = await Product.findAll({
        where: {
          PreviousPrice: {
            [Op.gt]: Product.sequelize.col('Price')
          }
        }
      });

      for (const product of priceDroppedProducts) {
        const wishlists = await Wishlist.findAll({ where: { ProductID: product.ProductID } });
        for (const wishlist of wishlists) {
          const recentNotification = await Notification.findOne({
            where: {
              UserID: wishlist.UserID,
              ProductID: product.ProductID,
              Type: 'price_drop',
              createdAt: { [Op.gt]: twentyFourHoursAgo }
            }
          });

          if (!recentNotification) {
            await Notification.create({
              UserID: wishlist.UserID,
              ProductID: product.ProductID,
              Message: `Price drop alert! ${product.ProductName} is now ${product.Price}.`,
              Type: 'price_drop'
            });
          }
        }
        // Update PreviousPrice to match current Price to prevent repeated notifications
        await product.update({ PreviousPrice: product.Price });
      }

      // 2. Check for Low Stock
      const lowStockProducts = await Product.findAll({
        where: {
          StockQuantity: { [Op.lt]: 5, [Op.gt]: 0 } // Below 5 but not 0
        }
      });

      for (const product of lowStockProducts) {
        const wishlists = await Wishlist.findAll({ where: { ProductID: product.ProductID } });
        for (const wishlist of wishlists) {
          const recentNotification = await Notification.findOne({
            where: {
              UserID: wishlist.UserID,
              ProductID: product.ProductID,
              Type: 'low_stock',
              createdAt: { [Op.gt]: twentyFourHoursAgo }
            }
          });

          if (!recentNotification) {
            await Notification.create({
              UserID: wishlist.UserID,
              ProductID: product.ProductID,
              Message: `Low stock! Only ${product.StockQuantity} left for ${product.ProductName}.`,
              Type: 'low_stock'
            });
          }
        }
      }

      // 3. Check for Promos / Flash Sales
      const promoProducts = await Product.findAll({
        where: {
          [Op.or]: [
            { IsFlashSale: true },
            { DiscountPercentage: { [Op.gt]: 0 } }
          ]
        }
      });

      for (const product of promoProducts) {
        const wishlists = await Wishlist.findAll({ where: { ProductID: product.ProductID } });
        for (const wishlist of wishlists) {
          const recentNotification = await Notification.findOne({
            where: {
              UserID: wishlist.UserID,
              ProductID: product.ProductID,
              Type: 'promo',
              createdAt: { [Op.gt]: twentyFourHoursAgo }
            }
          });

          if (!recentNotification) {
            let message = `Promo alert! ${product.ProductName} is on sale.`;
            if (product.IsFlashSale) {
               message = `Flash Sale! ${product.ProductName} is currently in a flash sale.`;
            } else if (product.DiscountPercentage > 0) {
               message = `${product.DiscountPercentage}% discount on ${product.ProductName}.`;
            }

            await Notification.create({
              UserID: wishlist.UserID,
              ProductID: product.ProductID,
              Message: message,
              Type: 'promo'
            });
          }
        }
      }

    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
};

module.exports = { startCronJobs };
