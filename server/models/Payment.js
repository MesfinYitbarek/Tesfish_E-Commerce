import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // Payment Information
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Related Documents
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  // User Information
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'ETB'
  },
  paymentMethod: {
    type: String,
    enum: ['telebirr', 'mobile-transfer', 'stripe', 'paypal', 'bank-transfer', 'cash'],
    required: true
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // External Payment Information
  externalPaymentId: String,
  gatewayResponse: mongoose.Schema.Types.Mixed,
  
  // Fees
  platformFee: {
    type: Number,
    default: 0
  },
  gatewayFee: {
    type: Number,
    default: 0
  },
  netAmount: Number,
  
  // Additional Information
  description: String,
  metadata: mongoose.Schema.Types.Mixed,
  
  // Refund Information
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  refundDate: Date,
  
  // Timeline
  paidAt: Date,
  expiredAt: Date
}, {
  timestamps: true
});

// paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ payer: 1 });
paymentSchema.index({ payee: 1 });
paymentSchema.index({ status: 1 });

export default mongoose.model('Payment', paymentSchema);