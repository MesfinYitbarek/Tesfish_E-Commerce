import mongoose from 'mongoose';

const serviceInquirySchema = new mongoose.Schema({
  // Basic inquiry info
  inquiryNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Service provider is now handled by the admin team
  assignedAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References admin user who is handling this inquiry
    required: false // Will be assigned when inquiry is picked up
  },
  
  // Service details
  serviceType: {
    type: String,
    enum: ['project-management', 'engineering-design', 'interior-design', 'real-estate-consultancy','mineral-services'],
    required: true
  },
  
  // Project details
  projectDetails: {
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    validate: {
      validator: v => v && v.trim().length > 0,
      message: 'Project title cannot be empty'
    }
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    validate: {
      validator: v => v && v.trim().length > 0,
      message: 'Project description cannot be empty'
    }
  },
  location: {
    city: {
      type: String,
      required: [true, 'Project location is required'],
      trim: true,
      validate: {
        validator: v => v && v.trim().length > 0,
        message: 'Project location cannot be empty'
      }
    }
  },
    timeline: {
      startDate: Date,
      endDate: Date,
      urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
      }
    },
    budget: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'ETB'
      },
      isFlexible: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Service-specific details
  serviceSpecifics: {
    // Project Management specifics
    projectManagement: {
      projectType: {
        type: String,
        enum: ['construction', 'renovation', 'development', 'infrastructure', 'other']
      },
      projectScale: {
        type: String,
        enum: ['small', 'medium', 'large', 'mega']
      },
      servicesNeeded: [{
        type: String,
        enum: [
          'project-initiation',
          'cost-definition',
          'contract-administration',
          'tender-procurement',
          'feasibility-study',
          'work-planning',
          'budget-planning',
          'resource-planning',
          'stakeholder-management',
          'company-auditing'
        ]
      }],
      teamSize: Number,
      existingTeam: Boolean
    },
    
    // Engineering Design specifics
    engineeringDesign: {
      designType: {
        type: String,
        enum: ['civil', 'architectural', 'mep', 'structural', 'all']
      },
      projectCategory: {
        type: String,
        enum: ['roads', 'buildings', 'bridges', 'infrastructure']
      },
      servicesNeeded: [{
        type: String,
        enum: [
          'civil-design',
          'architectural-design',
          'mep-design',
          'boq-preparation',
          'cost-estimation',
          'tender-documents',
          'supervision',
          'contract-administration'
        ]
      }],
      existingPlans: Boolean,
      regulatoryRequirements: [String]
    },
    
    // Interior Design specifics
    interiorDesign: {
      buildingType: {
        type: String,
        enum: ['residential-villa', 'residential-apartment', 'commercial-office', 'hotel', 'other']
      },
      serviceScope: {
        type: String,
        enum: ['design-only', 'design-and-build', 'consultation', 'renovation']
      },
      spaces: [{
        name: String,
        area: Number,
        requirements: String
      }],
      style: {
        type: String,
        enum: ['modern', 'traditional', 'contemporary', 'minimalist', 'luxury', 'mixed']
      },
      totalArea: Number,
      furnishing: {
        type: String,
        enum: ['full', 'partial', 'consultation-only']
      }
    },
    
    // Real Estate Consultancy specifics
    realEstateConsultancy: {
      consultationType: {
        type: String,
        enum: ['buying-advisory', 'technical-advisory', 'legal-advisory', 'investment-advisory', 'comprehensive']
      },
      propertyType: {
        type: String,
        enum: ['apartment', 'villa', 'commercial', 'land', 'investment']
      },
      propertyDetails: {
        location: String,
        size: Number,
        price: Number,
        currency: String,
        age: Number
      },
      concerns: [String],
      timeframe: {
        type: String,
        enum: ['immediate', 'within-month', 'within-3-months', 'flexible']
      }
    }
  },
  
  // Attachments
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status and workflow
  status: {
    type: String,
    enum: ['pending', 'under-review', 'quoted', 'negotiating', 'accepted', 'in-progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  
  // Status history for audit trail
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Quotes (submitted by admin team)
  quotes: [{
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Admin who submitted the quote
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'ETB'
    },
    breakdown: [{
      item: String,
      cost: Number,
      description: String
    }],
    timeline: {
      estimatedDays: Number,
      startDate: Date,
      milestones: [{
        name: String,
        date: Date,
        description: String
      }]
    },
    terms: String,
    validUntil: {
      type: Date,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired'],
      default: 'pending'
    },
    customerResponse: {
      action: String, // 'accepted' or 'rejected'
      message: String,
      respondedAt: Date
    }
  }],
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    attachments: [{
      name: String,
      url: String,
      type: String
    }],
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Consultation/Meeting (scheduled by admin)
  consultation: {
    scheduled: {
      type: Boolean,
      default: false
    },
    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Admin who scheduled the consultation
    },
    dateTime: Date,
    duration: Number, // in minutes
    location: {
      type: String,
      enum: ['online', 'office', 'site-visit', 'client-location']
    },
    meetingLink: String,
    notes: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    scheduledAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    cancelledAt: Date
  },
  
  // Analytics and tracking
  analytics: {
    responseTime: Number, // time to first response in hours
    conversionTime: Number, // time from inquiry to acceptance in hours
    customerSatisfaction: {
      rating: Number,
      feedback: String,
      submittedAt: Date
    }
  },
  
  // Priority and flags
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  tags: [String],
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  // Internal notes (admin only)
  internalNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Metadata
  source: {
    type: String,
    enum: ['website', 'referral', 'direct', 'marketing'],
    default: 'website'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
serviceInquirySchema.index({ customer: 1, createdAt: -1 });
serviceInquirySchema.index({ assignedAdmin: 1, status: 1 });
serviceInquirySchema.index({ serviceType: 1, status: 1 });
serviceInquirySchema.index({ inquiryNumber: 1 });
serviceInquirySchema.index({ 'projectDetails.location.city': 1 });
serviceInquirySchema.index({ status: 1, createdAt: -1 });
serviceInquirySchema.index({ priority: 1, isUrgent: -1 });

// Virtual for days since inquiry
serviceInquirySchema.virtual('daysSinceInquiry').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for response time status
serviceInquirySchema.virtual('responseStatus').get(function() {
  const hoursElapsed = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  
  if (this.status === 'pending') {
    if (hoursElapsed > 48) return 'overdue';
    if (hoursElapsed > 24) return 'due';
    return 'on-time';
  }
  
  return this.analytics?.responseTime ? 
    (this.analytics.responseTime > 24 ? 'late' : 'on-time') : 
    'unknown';
});

// Pre-save middleware to generate inquiry number
serviceInquirySchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    const servicePrefix = {
      'project-management': 'PM',
      'engineering-design': 'ED',
      'interior-design': 'ID',
      'real-estate-consultancy': 'RC'
    };
    
    this.inquiryNumber = `${servicePrefix[this.serviceType]}${new Date().getFullYear()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to update analytics
serviceInquirySchema.pre('save', function(next) {
  // Calculate response time if status changed from pending
  if (this.isModified('status') && this.status !== 'pending' && !this.analytics?.responseTime) {
    this.analytics = this.analytics || {};
    this.analytics.responseTime = (Date.now() - this.createdAt) / (1000 * 60 * 60); // hours
  }
  
  // Calculate conversion time if status changed to accepted
  if (this.isModified('status') && this.status === 'accepted' && !this.analytics?.conversionTime) {
    this.analytics = this.analytics || {};
    this.analytics.conversionTime = (Date.now() - this.createdAt) / (1000 * 60 * 60); // hours
  }
  
  next();
});

// Static methods
serviceInquirySchema.statics.getInquiryStats = function(filters = {}) {
  const matchStage = { ...filters };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $facet: {
        statusDistribution: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              avgBudget: { $avg: '$projectDetails.budget.max' }
            }
          }
        ],
        serviceTypeDistribution: [
          {
            $group: {
              _id: '$serviceType',
              count: { $sum: 1 }
            }
          }
        ],
        monthlyTrend: [
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              count: { $sum: 1 },
              revenue: { $sum: { $max: '$quotes.amount' } }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ],
        overview: [
          {
            $group: {
              _id: null,
              totalInquiries: { $sum: 1 },
              avgResponseTime: { $avg: '$analytics.responseTime' },
              conversionRate: {
                $avg: {
                  $cond: [
                    { $in: ['$status', ['accepted', 'completed']] },
                    1,
                    0
                  ]
                }
              }
            }
          }
        ]
      }
    }
  ]);
};

serviceInquirySchema.statics.getAdminWorkload = function() {
  return this.aggregate([
    {
      $match: {
        status: { $in: ['pending', 'under-review', 'quoted'] }
      }
    },
    {
      $group: {
        _id: '$assignedAdmin',
        pendingCount: { $sum: 1 },
        avgResponseTime: { $avg: '$analytics.responseTime' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'admin'
      }
    }
  ]);
};

export default mongoose.model('ServiceInquiry', serviceInquirySchema);