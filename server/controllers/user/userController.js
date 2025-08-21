import User from '../../models/User.js';
import Product from '../../models/Product.js';
import { uploadToCloudinary } from '../../utils/upload/cloudinaryService.js';

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by user type
    if (req.query.userType) {
      query.userType = req.query.userType;
    }

    // Filter by verification status
    if (req.query.isVerified !== undefined) {
      query.isVerified = req.query.isVerified === 'true';
    }

    // Search by name/email
    if (req.query.search) {
      query.$or = [
        { email: { $regex: req.query.search, $options: 'i' } },
        { 'companyProfile.companyName': { $regex: req.query.search, $options: 'i' } },
        { 'individualProfile.firstName': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check authorization
    if (user._id.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // Handle profile image upload
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, 'profiles');
      
      if (user.userType === 'company') {
        req.body.companyProfile = { ...req.body.companyProfile, logo: uploadResult.secure_url };
      } else if (user.userType === 'individual') {
        req.body.individualProfile = { ...req.body.individualProfile, avatar: uploadResult.secure_url };
      } else if (user.userType === 'customer') {
        req.body.customerProfile = { ...req.body.customerProfile, avatar: uploadResult.secure_url };
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};

// @desc    Add/Remove from wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private (Customers only)
export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const wishlist = user.customerProfile?.wishlist || [];
    const productIndex = wishlist.findIndex(id => id.toString() === productId);

    if (productIndex > -1) {
      // Remove from wishlist
      wishlist.splice(productIndex, 1);
    } else {
      // Add to wishlist
      wishlist.push(productId);
    }

    user.customerProfile.wishlist = wishlist;
    await user.save();

    res.status(200).json({
      success: true,
      message: productIndex > -1 ? 'Removed from wishlist' : 'Added to wishlist',
      data: { wishlist: wishlist.length }
    });
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating wishlist'
    });
  }
};

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private (Customers only)
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('customerProfile.wishlist', 'title pricing media status');

    const wishlist = user.customerProfile?.wishlist || [];

    res.status(200).json({
      success: true,
      data: { wishlist }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching wishlist'
    });
  }
};

// @desc    Export user data as CSV
// @route   GET /api/users/export
// @access  Private (Admin only)
export const exportUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    const csvHeader = 'ID,Email,User Type,Full Name,Phone,City,Created At,Verified\n';
    const csvData = users.map(user => {
      const fullName = user.fullName || '';
      const phone = user.companyProfile?.contactInfo?.phone || 
                   user.individualProfile?.phone || 
                   user.customerProfile?.phone || '';
      const city = user.companyProfile?.address?.city || 
                  user.individualProfile?.address?.city || '';
      
      return `${user._id},"${user.email}","${user.userType}","${fullName}","${phone}","${city}","${user.createdAt}","${user.isVerified}"`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.status(200).send(csvHeader + csvData);
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting users'
    });
  }
};