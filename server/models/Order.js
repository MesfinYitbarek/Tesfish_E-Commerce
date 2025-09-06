import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Order Information
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Order Items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    variant: String,
    specifications: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending'
    }
  }],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'ETB'
  },
  
  // Customer Information
  customerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  
  // Addresses
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially-refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['telebirr', 'mobile-transfer', 'stripe', 'paypal', 'bank-transfer', 'cash-on-delivery']
  },
  paymentId: String,
  
  // Special Order Types
  orderType: {
    type: String,
    enum: ['purchase', 'booking', 'service-request', 'consultation'],
    default: 'purchase'
  },
  
  // Real Estate Specific
  registrationFee: Number,
  appointmentDate: Date,
  
  // Service Specific
  serviceRequirements: String,
  preferredStartDate: Date,
  
  // Tracking
  trackingNumber: String,
  estimatedDelivery: Date,
  
  // Notes
  customerNotes: String,
  adminNotes: String,
  
  // Timeline
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

// orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);