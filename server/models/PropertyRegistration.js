import mongoose from 'mongoose';

const propertyRegistrationSchema = new mongoose.Schema({
  // Property Reference
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  
  // Customer Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Registration Details
  registrationNumber: {
    type: String,
    unique: true,
   // required: true
  },
  
  // Personal Information
  personalInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    alternatePhone: String,
    dateOfBirth: Date,
    nationality: String,
    occupation: String,
    employer: String,
    monthlyIncome: Number
  },
  
  // Address Information
  address: {
    current: {
      street: String,
      city: String,
      region: String,
      country: String,
      zipCode: String
    },
    permanent: {
      street: String,
      city: String,
      region: String,
      country: String,
      zipCode: String,
      sameAsCurrent: Boolean
    }
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  
  // Financial Information
  financialInfo: {
    bankName: String,
    accountNumber: String,
    creditScore: String,
    hasLoan: Boolean,
    loanDetails: String,
    monthlyExpenses: Number
  },
  
  // Payment Information
  payment: {
    registrationFee: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'ETB'
    },
    paymentMethod: {
      type: String,
      enum: ['chapa', 'bank-transfer', 'cash'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentDate: Date,
    receiptUrl: String
  },
  
  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['id-card', 'passport', 'license', 'bank-statement', 'salary-slip', 'other']
    },
    name: String,
    url: String,
    publicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under-review', 'completed'],
    default: 'pending'
  },
  
  // Notes and Comments
  notes: String,
  adminNotes: String,
  
  // Important Dates
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  approvedAt: Date,
  completedAt: Date,
  
  // Reviewer Information
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
propertyRegistrationSchema.index({ property: 1 });
propertyRegistrationSchema.index({ customer: 1 });
propertyRegistrationSchema.index({ registrationNumber: 1 });
propertyRegistrationSchema.index({ status: 1 });
propertyRegistrationSchema.index({ 'payment.paymentStatus': 1 });
propertyRegistrationSchema.index({ submittedAt: -1 });

// Pre-save middleware to generate registration number
propertyRegistrationSchema.pre('save', async function(next) {
  if (this.isNew && !this.registrationNumber) {
    const count = await this.constructor.countDocuments();
    this.registrationNumber = `REG${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model('PropertyRegistration', propertyRegistrationSchema);