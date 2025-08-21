import User from '../../models/User.js';
import Product from '../../models/Product.js';
import Order from '../../models/Order.js';
import Payment from '../../models/Payment.js';
import ServiceInquiry from '../../models/ServiceInquiry.js';
import Review from '../../models/Review.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // User statistics
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const usersByType = await User.aggregate([
      { $group: { _id: '$userType', count: { $sum: 1 } } }
    ]);

    // Product statistics
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const productsByCategory = await Product.aggregate([
      { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'categoryInfo' } },
      { $group: { _id: '$categoryInfo.name', count: { $sum: 1 } } }
    ]);

    // Order statistics
    const totalOrders = await Order.countDocuments();
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Revenue statistics
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const revenueThisMonth = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Service inquiry statistics
    const totalInquiries = await ServiceInquiry.countDocuments();
    const inquiriesByStatus = await ServiceInquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Review statistics
    const totalReviews = await Review.countDocuments();
    const averageRating = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
          byType: usersByType
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          byCategory: productsByCategory
        },
        orders: {
          total: totalOrders,
          thisMonth: ordersThisMonth,
          byStatus: ordersByStatus
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          thisMonth: revenueThisMonth[0]?.total || 0
        },
        serviceInquiries: {
          total: totalInquiries,
          byStatus: inquiriesByStatus
        },
        reviews: {
          total: totalReviews,
          averageRating: averageRating[0]?.avgRating || 0
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
export const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Daily registrations
    const dailyRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Daily orders
    const dailyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Popular products
    const popularProducts = await Product.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $project: {
          title: 1,
          views: 1,
          totalSales: 1,
          'categoryInfo.name': 1
        }
      }
    ]);

    // Top sellers
    const topSellers = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.seller',
          totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'sellerInfo'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        dailyRegistrations,
        dailyOrders,
        popularProducts,
        topSellers
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};

// @desc    Manage platform settings
// @route   PUT /api/admin/settings
// @access  Private (Admin only)
export const updateSettings = async (req, res) => {
  try {
    // This would typically update a Settings model
    // For now, we'll return success
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating settings'
    });
  }
};

// @desc    Approve/Reject reviews
// @route   PUT /api/admin/reviews/:id/moderate
// @access  Private (Admin only)
export const moderateReview = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = status;
    await review.save();

    res.status(200).json({
      success: true,
      message: `Review ${status} successfully`,
      data: { review }
    });
  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while moderating review'
    });
  }
};

// @desc    Export platform data
// @route   GET /api/admin/export/:type
// @access  Private (Admin only)
export const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    let data, filename, headers;

    switch (type) {
      case 'users':
        data = await User.find().select('-password');
        filename = 'users.csv';
        headers = 'ID,Email,User Type,Full Name,Phone,Created At,Verified\n';
        break;
      
      case 'orders':
        data = await Order.find().populate('customer', 'email');
        filename = 'orders.csv';
        headers = 'Order Number,Customer Email,Total,Status,Created At\n';
        break;
      
      case 'products':
        data = await Product.find().populate('seller', 'email').populate('category', 'name');
        filename = 'products.csv';
        headers = 'Title,Seller,Category,Price,Status,Created At\n';
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    const csvData = data.map(item => {
      switch (type) {
        case 'users':
          return `${item._id},"${item.email}","${item.userType}","${item.fullName || ''}","${item.companyProfile?.contactInfo?.phone || item.individualProfile?.phone || ''}","${item.createdAt}","${item.isVerified}"`;
        
        case 'orders':
          return `"${item.orderNumber}","${item.customer?.email || ''}",${item.total},"${item.status}","${item.createdAt}"`;
        
        case 'products':
          return `"${item.title}","${item.seller?.email || ''}","${item.category?.name || ''}",${item.pricing?.basePrice || 0},"${item.status}","${item.createdAt}"`;
        
        default:
          return '';
      }
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.status(200).send(headers + csvData);
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting data'
    });
  }
};