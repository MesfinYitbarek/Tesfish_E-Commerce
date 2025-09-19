// backend/models/PropertyRegistration.js
import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  alternatePhone: String,
  dateOfBirth: Date,
  nationality: String,
  occupation: String,
  employer: String,
  monthlyIncome: Number
}, { _id: false });

const addressSubSchema = new mongoose.Schema({
  street: String,
  city: String,
  region: String,
  country: { type: String, default: 'Ethiopia' },
  zipCode: String,
  sameAsCurrent: { type: Boolean, default: false }
}, { _id: false });

const emergencyContactSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  phone: String,
  email: String
}, { _id: false });

const financialInfoSchema = new mongoose.Schema({
  bankName: String,
  accountNumber: String,
  hasLoan: { type: Boolean, default: false },
  loanDetails: String,
  monthlyExpenses: Number
}, { _id: false });

const documentSchema = new mongoose.Schema({
  type: String,
  name: String,
  url: String,
  publicId: String
}, { _id: false });

const paymentSubSchema = new mongoose.Schema({
  provider: { type: String, enum: ['chapa'], default: 'chapa' },
  paymentStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  tx_ref: { type: String }, // chapa tx_ref
  paymentRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  amount: Number,
  currency: { type: String, default: 'ETB' },
  paidAt: Date
}, { _id: false });

const propertyRegistrationSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalInfo: personalInfoSchema,
  address: {
    current: addressSubSchema,
    permanent: addressSubSchema
  },
  emergencyContact: emergencyContactSchema,
  financialInfo: financialInfoSchema,
  documents: [documentSchema],
  status: { 
    type: String, 
    enum: ['pending', 'under-review', 'approved', 'rejected', 'cancelled'], 
    default: 'pending' 
  },
  payment: paymentSubSchema,
  notes: String,
  
  // ✅ ADD MISSING ADMIN REVIEW FIELDS
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  reviewedAt: { 
    type: Date,
    default: null
  },
  approvedAt: { 
    type: Date,
    default: null
  },
  rejectedAt: { 
    type: Date,
    default: null
  },
  
  // ✅ ADD ADMIN NOTES FIELD
  adminNotes: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Indexes
propertyRegistrationSchema.index({ registrationNumber: 1 }, { unique: true });
propertyRegistrationSchema.index({ customer: 1 });
propertyRegistrationSchema.index({ property: 1 });
propertyRegistrationSchema.index({ status: 1 });
propertyRegistrationSchema.index({ 'payment.paymentStatus': 1 });
propertyRegistrationSchema.index({ reviewedBy: 1 });
propertyRegistrationSchema.index({ createdAt: -1 });

export default mongoose.model('PropertyRegistration', propertyRegistrationSchema);