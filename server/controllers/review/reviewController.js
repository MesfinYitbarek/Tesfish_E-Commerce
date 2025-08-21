import Review from '../../models/Review.js';
import Product from '../../models/Product.js';
import Order from '../../models/Order.js';
import User from '../../models/User.js';

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const {
      reviewee,
      product,
      order,
      rating,
      title,
      content,
      ratings,
      images
    } = req.body;

    // Check if user has purchased the product or used the service
    if (order) {
      const orderData = await Order.findById(order);
      if (!orderData || orderData.customer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only review products/services you have purchased'
        });
      }
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewer: req.user.id,
      reviewee,
      product,
      order
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this item'
      });
    }

    const review = await Review.create({
      reviewer: req.user.id,
      reviewee,
      product,
      order,
      rating,
      title,
      content,
      ratings,
      images: images || []
    });

    // Update product/seller ratings
    await updateRatings(reviewee, product);

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'customerProfile.firstName customerProfile.lastName individualProfile.firstName individualProfile.lastName')
      .populate('product', 'title');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review: populatedReview }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { product: productId, status: 'approved' };

    // Rating filter
    if (req.query.rating) {
      query.rating = parseInt(req.query.rating);
    }

    // Sort options
    let sort = { createdAt: -1 };
    if (req.query.sort === 'helpful') {
      sort = { helpfulVotes: -1 };
    } else if (req.query.sort === 'rating-high') {
      sort = { rating: -1 };
    } else if (req.query.sort === 'rating-low') {
      sort = { rating: 1 };
    }

    const reviews = await Review.find(query)
      .populate('reviewer', 'customerProfile.firstName customerProfile.lastName individualProfile.firstName individualProfile.lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        ratingDistribution,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalReviews: total
        }
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// @desc    Get seller reviews
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
export const getSellerReviews = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ 
      reviewee: sellerId, 
      status: 'approved' 
    })
      .populate('reviewer', 'customerProfile.firstName customerProfile.lastName')
      .populate('product', 'title media')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ 
      reviewee: sellerId, 
      status: 'approved' 
    });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalReviews: total
        }
      }
    });
  } catch (error) {
    console.error('Get seller reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching seller reviews'
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('reviewer', 'customerProfile.firstName customerProfile.lastName');

    // Update ratings
    await updateRatings(review.reviewee, review.product);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: { review: updatedReview }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership or admin
    if (review.reviewer.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    // Update ratings
    await updateRatings(review.reviewee, review.product);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};

// @desc    Add helpful vote
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const addHelpfulVote = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.helpfulVotes += 1;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Helpful vote added',
      data: { helpfulVotes: review.helpfulVotes }
    });
  } catch (error) {
    console.error('Add helpful vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding helpful vote'
    });
  }
};

// @desc    Respond to review (seller)
// @route   PUT /api/reviews/:id/respond
// @access  Private (Sellers only)
export const respondToReview = async (req, res) => {
  try {
    const { content } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the reviewee (seller)
    if (review.reviewee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the seller can respond to this review'
      });
    }

    review.sellerResponse = {
      content,
      respondedAt: new Date()
    };

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while responding to review'
    });
  }
};

// Helper function to update ratings
const updateRatings = async (sellerId, productId) => {
  try {
    // Update seller rating
    const sellerReviews = await Review.find({ 
      reviewee: sellerId, 
      status: 'approved' 
    });
    
    if (sellerReviews.length > 0) {
      const averageRating = sellerReviews.reduce((sum, review) => sum + review.rating, 0) / sellerReviews.length;
      
      await User.findByIdAndUpdate(sellerId, {
        'sellerRating.average': Math.round(averageRating * 10) / 10,
        'sellerRating.totalReviews': sellerReviews.length
      });
    }

    // Update product rating if productId exists
    if (productId) {
      const productReviews = await Review.find({ 
        product: productId, 
        status: 'approved' 
      });
      
      if (productReviews.length > 0) {
        const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
        
        await Product.findByIdAndUpdate(productId, {
          'reviews.average': Math.round(averageRating * 10) / 10,
          'reviews.count': productReviews.length
        });
      }
    }
  } catch (error) {
    console.error('Update ratings error:', error);
  }
};