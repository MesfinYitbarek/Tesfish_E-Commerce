import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
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
  
  // Seller/Agent Information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Appointment Details
  appointmentNumber: {
    type: String,
    unique: true,
  },
  
  // Contact Information
  contactInfo: {
    name: {
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
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email', 'whatsapp'],
      default: 'phone'
    }
  },
  
  // Appointment Scheduling
  scheduledDateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 60 // minutes
  },
  
  // Appointment Type
  appointmentType: {
    type: String,
    // enum: ['property-viewing', 'consultation', 'documentation', 'negotiation'],
    default: 'property-viewing'
  },
  
  // Meeting Details
  meetingDetails: {
    location: {
      type: String,
      // enum: ['property-site', 'office', 'online', 'customer-location'],
      default: 'property-site'
    },
    address: String,
    meetingLink: String, // For online meetings
    specialInstructions: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rescheduled', 'no-show'],
    default: 'pending'
  },
  
  // Rescheduling
  reschedulingHistory: [{
    originalDate: Date,
    newDate: Date,
    reason: String,
    rescheduledBy: {
      type: String,
      enum: ['customer', 'seller', 'admin']
    },
    rescheduledAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Notes and Requirements
  customerNotes: String,
  sellerNotes: String,
  adminNotes: String,
  requirements: [String], // ID verification, deposit, etc.
  
  // Outcome
  outcome: {
    attended: Boolean,
    interestLevel: {
      type: String,
      enum: ['very-high', 'high', 'medium', 'low', 'no-interest']
    },
    feedback: String,
    nextSteps: String,
    followUpDate: Date
  },
  
  // Notifications
  notifications: {
    sent: [{
      type: {
        type: String,
        enum: ['confirmation', 'reminder', 'cancellation', 'rescheduling']
      },
      sentAt: Date,
      method: String // email, sms, push
    }],
    reminderScheduled: Boolean
  },
  
  // Important Dates
  createdAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  completedAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes
appointmentSchema.index({ property: 1 });
appointmentSchema.index({ customer: 1 });
appointmentSchema.index({ seller: 1 });
appointmentSchema.index({ scheduledDateTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentNumber: 1 });

// Pre-save middleware to generate appointment number
appointmentSchema.pre('save', async function(next) {
  if (this.isNew && !this.appointmentNumber) {
    const count = await this.constructor.countDocuments();
    this.appointmentNumber = `APP${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model('Appointment', appointmentSchema);