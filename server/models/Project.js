// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  longDescription: {
    type: String,
    maxlength: [2000, 'Long description cannot exceed 2000 characters']
  },

  // Project Classification
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: [
      'project-management',
      'engineering', 
      'interior',
      'real-estate',
      'mineral',
      'construction',
      'consulting'
    ]
  },
  status: {
    type: String,
    required: [true, 'Project status is required'],
    enum: ['completed', 'ongoing', 'planning', 'paused', 'cancelled'],
    default: 'planning'
  },

  // Client Information
  client: {
    name: {
      type: String,
      required: [true, 'Client name is required']
    },
    email: String,
    phone: String,
    company: String,
    website: String
  },

  // Project Details
  location: {
    address: String,
    city: String,
    region: String,
    country: {
      type: String,
      default: 'Ethiopia'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // Timeline
  timeline: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: Date,
    expectedCompletion: Date,
    completedDate: Date,
    duration: {
      type: String,
      required: [true, 'Duration is required']
    }
  },

  // Financial Information
  budget: {
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0, 'Budget cannot be negative']
    },
    currency: {
      type: String,
      default: 'ETB',
      enum: ['ETB', 'USD', 'EUR']
    },
    breakdown: [{
      category: String,
      amount: Number,
      description: String
    }]
  },

  // Project Progress
  progress: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    milestones: [{
      name: String,
      description: String,
      targetDate: Date,
      completedDate: Date,
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'delayed'],
        default: 'pending'
      }
    }],
    phases: [{
      name: String,
      description: String,
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started'
      }
    }]
  },

  // Media
  media: {
    images: [{
      url: String,
      publicId: String,
      alt: String,
      caption: String,
      isPrimary: {
        type: Boolean,
        default: false
      },
      category: {
        type: String,
        enum: ['before', 'during', 'after', 'planning', 'gallery'],
        default: 'gallery'
      }
    }],
    videos: [{
      url: String,
      publicId: String,
      title: String,
      description: String,
      thumbnail: String
    }],
    documents: [{
      url: String,
      publicId: String,
      name: String,
      type: String,
      size: Number
    }]
  },

  // Project Features & Services
  features: [{
    type: String,
    trim: true
  }],
  services: [{
    name: String,
    description: String,
    category: String
  }],
  technologies: [{
    name: String,
    category: String,
    description: String
  }],

  // Team & Resources
  team: [{
    name: String,
    role: String,
    department: String,
    expertise: [String]
  }],
  resources: [{
    name: String,
    type: String,
    quantity: Number,
    unit: String
  }],

  // Testimonials & Reviews
  testimonial: {
    text: String,
    author: {
      name: String,
      position: String,
      company: String,
      avatar: String
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    date: Date
  },

  // SEO & Display
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String
  },
  displaySettings: {
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    showInPortfolio: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },

  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    inquiries: {
      type: Number,
      default: 0
    },
    lastViewed: Date
  },

  // Admin Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Awards & Recognition
  awards: [{
    name: String,
    organization: String,
    year: Number,
    description: String,
    image: String
  }],

  // Project Challenges & Solutions
  challenges: [{
    challenge: String,
    solution: String,
    impact: String
  }],

  // Sustainability & Impact
  sustainability: {
    environmentalImpact: String,
    sustainabilityFeatures: [String],
    certifications: [{
      name: String,
      issuedBy: String,
      date: Date,
      validUntil: Date
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
projectSchema.index({ slug: 1 });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ 'timeline.startDate': -1 });
projectSchema.index({ 'budget.amount': 1 });
projectSchema.index({ 'displaySettings.isFeatured': 1 });
projectSchema.index({ 'displaySettings.isPublic': 1 });
projectSchema.index({ 'analytics.views': -1 });
projectSchema.index({ title: 'text', description: 'text', longDescription: 'text' });

// Virtual for budget display
projectSchema.virtual('budgetDisplay').get(function() {
  if (this.budget.currency === 'ETB') {
    return `ETB ${this.budget.amount.toLocaleString()}`;
  }
  return `${this.budget.currency} ${this.budget.amount.toLocaleString()}`;
});

// Virtual for completion status
projectSchema.virtual('completionStatus').get(function() {
  if (this.status === 'completed') return 'Completed';
  if (this.status === 'ongoing') return `${this.progress.percentage}% Complete`;
  if (this.status === 'planning') return 'In Planning';
  return this.status;
});

// Virtual for project duration calculation
projectSchema.virtual('actualDuration').get(function() {
  if (this.timeline.completedDate && this.timeline.startDate) {
    const diffTime = Math.abs(this.timeline.completedDate - this.timeline.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return `${months} months, ${days} days`;
  }
  return null;
});

// Pre-save middleware to generate slug
projectSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

// Pre-save middleware to update progress
projectSchema.pre('save', function(next) {
  if (this.status === 'completed' && this.progress.percentage < 100) {
    this.progress.percentage = 100;
    this.timeline.completedDate = new Date();
  }
  next();
});

// Methods
projectSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  return this.save();
};

projectSchema.methods.isOverdue = function() {
  if (this.status === 'completed' || !this.timeline.expectedCompletion) return false;
  return new Date() > this.timeline.expectedCompletion;
};

projectSchema.methods.getDaysRemaining = function() {
  if (this.status === 'completed' || !this.timeline.expectedCompletion) return null;
  const diffTime = this.timeline.expectedCompletion - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Static methods
projectSchema.statics.getFeaturedProjects = function(limit = 6) {
  return this.find({
    'displaySettings.isFeatured': true,
    'displaySettings.isPublic': true
  })
  .sort({ 'displaySettings.displayOrder': 1, 'analytics.views': -1 })
  .limit(limit)
  .populate('createdBy', 'fullName email');
};

projectSchema.statics.getProjectsByCategory = function(category, limit = 10) {
  return this.find({
    category,
    'displaySettings.isPublic': true
  })
  .sort({ 'timeline.startDate': -1 })
  .limit(limit);
};

projectSchema.statics.getProjectStats = function() {
  return this.aggregate([
    {
      $facet: {
        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalBudget: { $sum: '$budget.amount' }
            }
          }
        ],
        byCategory: [
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              avgBudget: { $avg: '$budget.amount' }
            }
          }
        ],
        overview: [
          {
            $group: {
              _id: null,
              totalProjects: { $sum: 1 },
              totalBudget: { $sum: '$budget.amount' },
              avgBudget: { $avg: '$budget.amount' },
              totalViews: { $sum: '$analytics.views' },
              avgProgress: { $avg: '$progress.percentage' }
            }
          }
        ]
      }
    }
  ]);
};

export default mongoose.model('Project', projectSchema);