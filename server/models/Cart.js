import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: Number,
    variant: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

cartSchema.index({ customer: 1 });

export default mongoose.model('Cart', cartSchema);