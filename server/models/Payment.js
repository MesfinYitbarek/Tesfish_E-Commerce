// backend/models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // this is used as Chapa tx_ref
  paymentId: { type: String, required: true, unique: true },

  // relation to the registration (optional for other use-cases)
  registration: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyRegistration' },

  // who paid
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // optional payee (seller/admin)
  payee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  amount: { type: Number, required: true },
  currency: { type: String, default: 'ETB' },
  provider: { type: String, enum: ['chapa'], default: 'chapa' },

  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },

  // info from Chapa
  externalPaymentId: String,
  gatewayResponse: mongoose.Schema.Types.Mixed,

  platformFee: { type: Number, default: 0 },
  netAmount: Number,

  refundAmount: { type: Number, default: 0 },
  refundReason: String,
  refundDate: Date,

  paidAt: Date,
  expiredAt: Date,

  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

paymentSchema.index({ paymentId: 1 }, { unique: true });
paymentSchema.index({ payer: 1 });
paymentSchema.index({ status: 1 });

export default mongoose.model('Payment', paymentSchema);
