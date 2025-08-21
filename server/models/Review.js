import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Review Information
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  // Review Content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: String,
  content: {
    type: String,
    required: true
  },
  
  // Review Categories
  ratings: {
    quality: Number,
    communication: Number,
    delivery: Number,
    value: Number
  },
  
  // Media
  images: [String],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Helpful Votes
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  // Response from Seller
  sellerResponse: {
    content: String,
    respondedAt: Date
  }
}, {
  timestamps: true
});

reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ product: 1 });
reviewSchema.index({ rating: 1 });

export default mongoose.model('Review', reviewSchema);
