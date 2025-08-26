import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  image: String,
  icon: String,
  
  // Hierarchical structure
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // Category level (0 = root, 1 = main category, 2 = subcategory)
  level: {
    type: Number,
    default: 0
  },
  
  // Product type this category belongs to
  productType: {
    type: String,
    enum: ['homes', 'plots', 'commercials', 'others', 'all'],
    default: 'all'
  },
  
  // Category type for better organization
  categoryType: {
    type: String,
    enum: ['main', 'property-type', 'feature', 'location', 'price-range'],
    default: 'main'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  // Category specific configurations
  config: {
    allowSubcategories: {
      type: Boolean,
      default: true
    },
    requiresApproval: {
      type: Boolean,
      default: false
    },
    maxProducts: Number,
    features: [String] // Available features for this category
  },
  
  // Statistics
  stats: {
    productCount: {
      type: Number,
      default: 0
    },
    averagePrice: Number,
    lastUpdated: Date
  }
}, {
  timestamps: true
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ productType: 1 });
categorySchema.index({ level: 1, sortOrder: 1 });
categorySchema.index({ isActive: 1, sortOrder: 1 });

// Virtual for breadcrumb path
categorySchema.virtual('breadcrumbPath', {
  ref: 'Category',
  localField: 'parentCategory',
  foreignField: '_id',
  justOne: true
});

export default mongoose.model('Category', categorySchema);