import mongoose from 'mongoose';

const serviceInquirySchema = new mongoose.Schema({
  // Inquiry Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Service Details
  serviceType: {
    type: String,
    enum: ['project-management', 'engineering-design', 'interior-design', 'consultancy', 'other'],
    required: true
  },
  
  // Customer Information
  customerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    company: String
  },
  
  // Project Details
  projectDetails: {
    title: String,
    description: {
      type: String,
      required: true
    },
    budget: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'ETB'
      }
    },
    timeline: {
      startDate: Date,
      endDate: Date,
      duration: String
    },
    location: String,
    requirements: [String],
    deliverables: [String]
  },
  
  // Attachments
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  
  // Quote Information
  quote: {
    amount: Number,
    currency: {
      type: String,
      default: 'ETB'
    },
    breakdown: [{
      item: String,
      cost: Number,
      description: String
    }],
    validUntil: Date,
    terms: String,
    quotedAt: Date
  },
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: String,
    attachments: [String],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Follow-up
  followUpDate: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

serviceInquirySchema.index({ customer: 1 });
serviceInquirySchema.index({ serviceProvider: 1 });
serviceInquirySchema.index({ serviceType: 1 });
serviceInquirySchema.index({ status: 1 });

export default mongoose.model('ServiceInquiry', serviceInquirySchema);