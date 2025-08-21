import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['product_view', 'product_search', 'user_registration', 'order_placed', 'payment_completed'],
    required: true
  },
  
  // Related documents
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  // Event data
  data: mongoose.Schema.Types.Mixed,
  
  // User session info
  sessionId: String,
  ipAddress: String,
  userAgent: String,
  
  // Geographic data
  country: String,
  city: String,
  
  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
analyticsSchema.index({ type: 1, timestamp: -1 });
analyticsSchema.index({ user: 1, timestamp: -1 });
analyticsSchema.index({ product: 1, timestamp: -1 });

export default mongoose.model('Analytics', analyticsSchema);