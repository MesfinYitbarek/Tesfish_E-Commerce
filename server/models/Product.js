import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: String,
  
  // Seller Information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerType: {
    type: String,
    enum: ['company', 'individual'],
    required: true
  },
  
  // Product Classification
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false 
  },
  productType: {
    type: String,
    // enum: ['physical', 'digital', 'service', 'real-estate', 'rental'],
    required: true
  },
  
  // Pricing
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    salePrice: Number,
    currency: {
      type: String,
      default: 'ETB'
    },
    isNegotiable: {
      type: Boolean,
      default: false
    },
    priceType: {
      type: String,
      enum: ['fixed', 'starting-from', 'per-unit', 'per-hour', 'per-day', 'per-month'],
      default: 'fixed'
    }
  },
  
  // Inventory
  inventory: {
    sku: String,
    stock: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    },
    trackInventory: {
      type: Boolean,
      default: true
    },
    allowBackorders: {
      type: Boolean,
      default: false
    }
  },
  
  // Media
  media: {
    images: [{
      url: String,
      alt: String,
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    videos: [String],
    documents: [{
      name: String,
      url: String,
      type: String
    }]
  },
  
  // Product Specifications
  specifications: [{
    name: String,
    value: String,
    group: String
  }],
  
  // Variants (for products with different options)
  variants: [{
    name: String, // Color, Size, etc.
    options: [{
      value: String,
      price: Number,
      stock: Number,
      sku: String,
      image: String
    }]
  }],
  
  // Real Estate Specific Fields
  realEstateDetails: {
    propertyType: {
      type: String,
      // enum: ['apartment', 'villa', 'commercial', 'land', 'office', 'warehouse']
    },
    bedrooms: Number,
    bathrooms: Number,
    area: {
      value: Number,
      unit: {
        type: String,
        // enum: ['sqft', 'sqm']
      }
    },
    floors: Number,
    parkingSpaces: Number,
    furnishingStatus: {
      type: String,
      enum: ['furnished', 'semi-furnished', 'unfurnished']
    },
    yearBuilt: Number,
    features: [String],
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      landmarks: [String]
    },
    registrationFee: Number,
    isProject: Boolean,
    projectDetails: {
      totalUnits: Number,
      availableUnits: Number,
      completionDate: Date,
      paymentPlan: String
    }
  },
  
  // Service Specific Fields
  serviceDetails: {
    serviceType: {
      type: String,
      // enum: ['project-management', 'engineering-design', 'interior-design', 'consultancy', 'other']
    },
    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ['hours', 'days', 'weeks', 'months']
      }
    },
    deliveryTime: String,
    location: {
      type: String,
      enum: ['on-site', 'remote', 'hybrid']
    },
    requirements: [String]
  },
  
  // Status
  status: {
    type: String,
    // enum: ['draft', 'active', 'sold', 'out-of-stock', 'discontinued'],
    default: 'draft'
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  
  // Reviews
  reviews: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Features
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotionExpiry: Date,
  
  // Shipping (for physical products)
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingClass: String,
    freeShipping: Boolean
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'pricing.basePrice': 1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model('Product', productSchema);