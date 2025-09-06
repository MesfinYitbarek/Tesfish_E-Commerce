import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false // prevent returning by default (safe for Google users with dummy password)
  },
  userType: {
    type: String,
    enum: ['company', 'individual', 'customer', 'admin'],
    required: true
  },

  // Social Logins
  googleId: {
    type: String,
    unique: true,
    sparse: true // allows null for non-Google users
  },
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise', 'expired'],
    default: 'free'
  },
  subscriptionExpiry: Date,
  
  // Seller Rating & Reviews
  sellerRating: {
    average: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  
  // Company-specific fields
  companyProfile: {
    companyName: String,
    registrationNumber: String,
    establishedYear: Number,
    description: String,
    website: String,
    logo: String,
    coverImage: String,
    businessCategories: [{
      type: String,
      enum: ['real-estate', 'construction', 'interior-design', 'engineering', 'general-retail', 'services', 'automotive', 'electronics', 'fashion', 'food-beverage']
    }],
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    contactInfo: {
      phone: String,
      alternatePhone: String,
      whatsapp: String,
      telegram: String,
      email: String
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String
    },
    certifications: [String],
    licenses: [String],
    portfolio: [{
      title: String,
      images: [String],
      description: String,
      completionDate: Date,
      location: String,
      category: String
    }],
    businessHours: {
      monday: { open: String, close: String, closed: Boolean },
      tuesday: { open: String, close: String, closed: Boolean },
      wednesday: { open: String, close: String, closed: Boolean },
      thursday: { open: String, close: String, closed: Boolean },
      friday: { open: String, close: String, closed: Boolean },
      saturday: { open: String, close: String, closed: Boolean },
      sunday: { open: String, close: String, closed: Boolean }
    }
  },
  
  // Individual-specific fields
  individualProfile: {
    firstName: String,
    lastName: String,
    avatar: String,
    phone: String,
    alternatePhone: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    idDocument: {
      type: String, // passport, nationalId, drivingLicense
      number: String,
      image: String
    },
    sellingCategories: [String]
  },
  
  // Customer-specific fields
  customerProfile: {
    firstName: String,
    lastName: String,
    avatar: String,
    phone: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    addresses: [{
      label: String, // home, office, other
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      isDefault: Boolean
    }],
    preferences: {
      categories: [String],
      priceRange: {
        min: Number,
        max: Number
      },
      brands: [String],
      notifications: {
        newProducts: Boolean,
        priceDrops: Boolean,
        orderUpdates: Boolean,
        promotions: Boolean
      }
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  
  // Payment Information
  paymentMethods: [{
    type: {
      type: String,
      enum: ['telebirr', 'mobile-transfer', 'bank-account', 'stripe', 'paypal']
    },
    details: mongoose.Schema.Types.Mixed,
    isDefault: Boolean
  }],
  
  // Verification
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  
  // Notifications Preferences
  notificationSettings: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  
  // Analytics
  totalSales: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.userType === 'company') {
    return this.companyProfile?.companyName;
  }
  if (this.individualProfile?.firstName && this.individualProfile?.lastName) {
    return `${this.individualProfile.firstName} ${this.individualProfile.lastName}`;
  }
  if (this.customerProfile?.firstName && this.customerProfile?.lastName) {
    return `${this.customerProfile.firstName} ${this.customerProfile.lastName}`;
  }
  return this.email;
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
// userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ 'companyProfile.companyName': 'text' });
userSchema.index({ 'companyProfile.businessCategories': 1 });

export default mongoose.model('User', userSchema);