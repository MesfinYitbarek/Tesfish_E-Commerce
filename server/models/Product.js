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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false, // or true if mandatory
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false, // or true if mandatory
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
    enum: ['company', 'individual','admin'],
    required: true
  },
  
  // Main Product Type
  productType: {
    type: String,
    required: true
  },
  
  // Sub Product Type based on main type
  subProductType: {
    type: String,
  },
  
  // Listing Type
  listingType: {
    type: String,
    enum: ['sell', 'rent'],
    required: function() {
      return ['homes', 'plots', 'commercials'].includes(this.productType);
    }
  },
  
  // Product Details
  brand: String,
  model: String,
  condition: {
    type: String,
    default: 'new'
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
      // enum: ['fixed', 'starting-from', 'per-unit', 'per-day', 'per-month', 'per-year'],
      default: 'fixed'
    },
    // For rental properties
    rentPrice: {
      monthly: Number,
      yearly: Number,
      deposit: Number
    }
  },
  
  // Inventory
  inventory: {
    sku: String,
    stock: {
      type: Number,
      default: 1
    },
    lowStockThreshold: {
      type: Number,
      default: 1
    },
    trackInventory: {
      type: Boolean,
      default: function() {
        return this.productType === 'others';
      }
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
      publicId: String,
      alt: String,
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    videos: [{
      url: String,
      publicId: String,
      title: String
    }],
    documents: [{
      name: String,
      url: String,
      type: String,
      publicId: String
    }],
    virtualTour: String
  },
  
  // Product Specifications
  specifications: [{
    name: String,
    value: String,
    group: String
  }],
  
  // Property Details (for homes, plots, commercials)
  propertyDetails: {
    // Basic Property Info
    propertyId: String, // Unique property identifier
    propertyType: String, // Redundant with subProductType but kept for clarity
    
    // Dimensions
    area: {
      value: Number,
      unit: {
        type: String,
        enum: ['sqft', 'sqm', 'hectares', 'acres'],
        default: 'sqm'
      }
    },
    
    // For Homes/Buildings
    bedrooms: Number,
    bathrooms: Number,
    floors: Number,
    parkingSpaces: Number,
    balconies: Number,
    
    // Property Features
    furnishingStatus: {
      type: String,
      enum: ['furnished', 'semi-furnished', 'unfurnished', 'not-applicable']
    },
    yearBuilt: Number,
    features: [String], // Pool, Garden, Security, etc.
    amenities: [String], // Gym, Elevator, etc.
    
    // Location Details
    location: {
      address: String,
      city: {
        type: String,
      
      },
      subcity: String,
      woreda: String,
      kebele: String,
      region: String,
      country: {
        type: String,
        default: 'Ethiopia'
      },
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      landmarks: [String],
      nearbyFacilities: [{
        type: String, // school, hospital, market, etc.
        name: String,
        distance: Number // in meters
      }]
    },
    
    // Legal & Registration
    registrationFee: {
      type: Number,
      default: 0
    },
    hasLegalDocuments: {
      type: Boolean,
      default: false
    },
    legalDocuments: [String], // List of available documents
    titleDeedStatus: {
      type: String,
      enum: ['clear', 'pending', 'disputed', 'not-applicable'],
      default: 'not-applicable'
    },
    
    // Project Details (for companies)
    isProject: {
      type: Boolean,
      default: false
    },
    projectDetails: {
      projectName: String,
      developer: String,
      totalUnits: Number,
      availableUnits: Number,
      soldUnits: {
        type: Number,
        default: 0
      },
      completionDate: Date,
      constructionStatus: {
        type: String,
        enum: ['planning', 'under-construction', 'completed'],
        default: 'planning'
      },
      paymentPlan: {
        type: String,
        enum: ['full-payment', 'installment', 'both']
      },
      installmentOptions: [{
        duration: Number, // months
        downPayment: Number, // percentage
        monthlyPayment: Number
      }],
      projectFeatures: [String],
      masterPlan: String // URL to master plan image
    },
    
    // Utilities & Services
    utilities: {
      electricity: Boolean,
      water: Boolean,
      internet: Boolean,
      gas: Boolean,
      sewerage: Boolean,
      garbage: Boolean
    },
    
    // For Plots/Land
    landDetails: {
      landUse: {
        type: String,
        enum: ['residential', 'commercial', 'mixed-use', 'agricultural', 'industrial']
      },
      topography: {
        type: String,
        enum: ['flat', 'sloped', 'hilly', 'mountainous']
      },
      soilType: String,
      waterSource: {
        type: String,
        enum: ['borehole', 'well', 'municipal', 'river', 'none']
      },
      accessRoad: {
        type: String,
        enum: ['paved', 'gravel', 'dirt', 'no-access']
      },
      developmentPotential: String
    }
  },
  
  // Business/Commercial Details
  businessDetails: {
    businessType: String,
    annualRevenue: Number,
    employees: Number,
    establishedYear: Number,
    equipment: [String],
    licenses: [String],
    financialDocuments: [String]
  },
  
  // Vehicle Details (for others category)
  vehicleDetails: {
    make: String,
    model: String,
    year: Number,
    mileage: Number,
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid']
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic']
    },
    color: String,
    engineSize: String,
    bodyType: String
  },
  
  // Equipment Details
  equipmentDetails: {
    manufacturer: String,
    model: String,
    year: Number,
    condition: String,
    hoursUsed: Number,
    specifications: [String]
  },
  //Basic Mineral Details (simplified)
  mineralDetails: {
    mineralName: {
      type: String,
      required: function() {
        return this.productType === 'minerals';
      }
    },
    mineralType: {
      type: String,
      enum: [
        'gold', 'silver', 'copper', 'iron', 'zinc', 'lead', 
        'gemstones', 'coal', 'salt', 'limestone', 'marble', 
        'granite', 'sand', 'gravel', 'other'
      ]
    },
    origin: {
      country: {
        type: String,
        default: 'Ethiopia'
      },
      region: String,
      mine: String
    },
    quality: {
      grade: {
        type: String,
        enum: ['premium', 'high', 'medium', 'standard', 'low'],
        default: 'standard'
      },
      purity: {
        type: Number, // Percentage 0-100
        min: 0,
        max: 100
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['grams', 'kg', 'tons'],
        default: 'kg'
      }
    },
    certification: {
      certified: {
        type: Boolean,
        default: false
      },
      certificationBody: String,
      certificateNumber: String,
      validUntil: Date
    }
  },
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'sold', 'rented', 'out-of-stock', 'discontinued', 'pending-approval'],
    default: 'active'
  },
  
  // Availability
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: Date,
    availableUntil: Date
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
  totalInquiries: {
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
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Contact & Viewing
  contactInfo: {
    phone: String,
    email: String,
    whatsapp: String,
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email', 'whatsapp', 'any']
    }
  },
  
  viewingDetails: {
    allowViewings: {
      type: Boolean,
      default: true
    },
    viewingDays: [String], // ['monday', 'tuesday', etc.]
    viewingHours: {
      start: String, // '09:00'
      end: String    // '17:00'
    },
    viewingRequirements: [String]
  },
  
  // Additional Fields
  tags: [String],
  notes: String, // Internal notes for seller
  
  // Warranty (for others category)
  warranty: {
    duration: Number,
    unit: {
      type: String,
      enum: ['days', 'months', 'years']
    },
    type: {
      type: String,
      enum: ['manufacturer', 'seller', 'none']
    },
    description: String
  },

  // Return Policy (for others category)
  returnPolicy: {
    returnable: {
      type: Boolean,
      default: function() {
        return this.productType === 'others';
      }
    },
    returnPeriod: Number, // in days
    conditions: [String]
  },
  
  // Shipping (for others category)
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingClass: String,
    freeShipping: Boolean,
    shippingCost: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ seller: 1 });
productSchema.index({ status: 1 });
productSchema.index({ productType: 1, subProductType: 1 });
productSchema.index({ listingType: 1 });
productSchema.index({ 'pricing.basePrice': 1 });
productSchema.index({ 'propertyDetails.location.city': 1 });
productSchema.index({ 'propertyDetails.location.region': 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: -1, isPromoted: -1 });
productSchema.index({ views: -1 });

// Compound indexes for common queries
productSchema.index({ productType: 1, listingType: 1, status: 1 });
productSchema.index({ seller: 1, status: 1, createdAt: -1 });
productSchema.index({ 'propertyDetails.location.city': 1, productType: 1, listingType: 1 });

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  if (this.status === 'sold' || this.status === 'rented') return false;
  if (this.status !== 'active') return false;
  if (this.inventory.trackInventory && this.inventory.stock <= 0) return false;
  return this.availability?.isAvailable !== false;
});

// Virtual for display price
productSchema.virtual('displayPrice').get(function() {
  if (this.listingType === 'rent' && this.pricing.rentPrice) {
    return this.pricing.rentPrice.monthly || this.pricing.rentPrice.yearly;
  }
  return this.pricing.salePrice || this.pricing.basePrice;
});

// Virtual for full address
productSchema.virtual('fullAddress').get(function() {
  if (!this.propertyDetails?.location) return '';
  const loc = this.propertyDetails.location;
  return [loc.address, loc.subcity, loc.city, loc.region].filter(Boolean).join(', ');
});

// Virtual for property type display
productSchema.virtual('propertyTypeDisplay').get(function() {
  const typeMap = {
    'houses': 'House',
    'apartment': 'Apartment',
    'villas': 'Villa',
    'condos': 'Condo',
    'townhouses': 'Townhouse',
    'offices': 'Office',
    'warehouses': 'Warehouse',
    'shops': 'Shop',
    'mixed-use-land': 'Mixed Use Land',
    'residential-land': 'Residential Land',
    'commercial-land': 'Commercial Land',
    'agricultural-land': 'Agricultural Land',
    'buildings': 'Building',
    'factories': 'Factory',
    'hotels': 'Hotel',
    'real-estate': 'Real Estate',
    'companies': 'Company',
    'electronics': 'Electronics',
    'vehicles': 'Vehicle',
    'furnitures': 'Furniture',
    'agricultural-products': 'Agricultural Products',
    'construction-equipment': 'Construction Equipment'
  };
  return typeMap[this.subProductType] || this.subProductType;
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  // Set default contact info from seller if not provided
  if (!this.contactInfo?.email && this.seller) {
    this.contactInfo = this.contactInfo || {};
    // This will be populated in the controller
  }
  
  // Auto-generate property ID for real estate
  if (['homes', 'plots', 'commercials'].includes(this.productType) && !this.propertyDetails?.propertyId) {
    this.propertyDetails = this.propertyDetails || {};
    this.propertyDetails.propertyId = `${this.productType.toUpperCase()}-${Date.now()}`;
  }
  
  next();
});

export default mongoose.model('Product', productSchema);