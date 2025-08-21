import Product from '../../models/Product.js';
import Order from '../../models/Order.js';
import User from '../../models/User.js';

// Track product view
export const trackProductView = async (productId, userId = null) => {
  try {
    await Product.findByIdAndUpdate(productId, { $inc: { views: 1 } });
    
    // You can also store detailed analytics in a separate Analytics model
    // await Analytics.create({
    //   type: 'product_view',
    //   productId,
    //   userId,
    //   timestamp: new Date()
    // });
  } catch (error) {
    console.error('Track product view error:', error);
  }
};

// Get seller analytics
export const getSellerAnalytics = async (sellerId, period = 30) => {
  try {
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

    // Sales data
    const salesData = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Product performance
    const productPerformance = await Product.aggregate([
      {
        $match: {
          seller: sellerId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $project: {
          title: 1,
          views: 1,
          totalSales: 1,
          'pricing.basePrice': 1
        }
      },
      { $sort: { views: -1 } }
    ]);

    // Total metrics
    const totalMetrics = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    return {
      salesData,
      productPerformance,
      totalRevenue: totalMetrics[0]?.totalRevenue || 0,
      totalOrders: totalMetrics[0]?.totalOrders || 0
    };
  } catch (error) {
    console.error('Get seller analytics error:', error);
    throw error;
  }
};