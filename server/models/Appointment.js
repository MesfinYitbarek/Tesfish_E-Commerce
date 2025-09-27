// models/Appointment.js
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
  
  // ✅ Employee Assignment (changed from seller)
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Employee assigned to handle the appointment
  },
  
  // ✅ Department Assignment
  assignedDepartment: {
    type: String,
    enum: [
      'real-estate',
      'interior-design', 
      'project-management',
      'engineering',
      'marketing',
      'sales',
      'finance',
      'hr',
      'admin',
      'it',
      'operations'
    ],
    default: 'real-estate'
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
    enum: [
      'property-viewing', 
      'consultation', 
      'property-evaluation',
      'contract-discussion',
      'design-consultation',
      'project-meeting',
      'engineering-consultation',
      'documentation',
      'negotiation'
    ],
    default: 'property-viewing'
  },
  
  // Meeting Details
  meetingDetails: {
    location: {
      type: String,
      enum: ['property-site', 'office', 'online', 'customer-location'],
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
  
  // ✅ Enhanced Rescheduling History
  reschedulingHistory: [{
    originalDate: Date,
    newDate: Date,
    reason: String,
    rescheduledBy: {
      type: String,
      enum: ['customer', 'employee', 'admin']
    },
    rescheduledById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rescheduledAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // ✅ Updated Notes and Requirements
  customerNotes: String,
  employeeNotes: String, // Changed from sellerNotes
  adminNotes: String,
  requirements: [String], // ID verification, deposit, etc.
  
  // ✅ Tracking Updates
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedByType: {
    type: String,
    enum: ['customer', 'employee', 'admin']
  },
  
  // ✅ Assignment History (for tracking reassignments)
  assignmentHistory: [{
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedDepartment: String,
    assignedAt: {
      type: Date,
      default: Date.now
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String
  }],
  
  // Outcome
  outcome: {
    attended: Boolean,
    interestLevel: {
      type: String,
      enum: ['very-high', 'high', 'medium', 'low', 'no-interest']
    },
    feedback: String,
    nextSteps: String,
    followUpDate: Date,
    // ✅ Additional outcome fields
    propertyShown: Boolean,
    documentsProvided: [String],
    followUpRequired: Boolean
  },
  
  // Notifications
  notifications: {
    sent: [{
      type: {
        type: String,
        enum: ['confirmation', 'reminder', 'cancellation', 'rescheduling', 'assignment']
      },
      sentAt: Date,
      method: String, // email, sms, push
      recipient: {
        type: String,
        enum: ['customer', 'employee', 'admin']
      }
    }],
    reminderScheduled: Boolean
  },
  
  // ✅ Employee Performance Tracking
  performance: {
    responseTime: Number, // Time to confirm/respond in minutes
    completionTime: Number, // Actual duration of appointment
    customerSatisfaction: {
      type: Number,
      min: 1,
      max: 5
    },
    employeeFeedback: String
  },
  
  // Important Dates
  createdAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  
  // ✅ Additional tracking dates
  assignedAt: {
    type: Date,
    default: Date.now
  },
  lastReassignedAt: Date
}, {
  timestamps: true
});

// Indexes
appointmentSchema.index({ property: 1 });
appointmentSchema.index({ customer: 1 });
appointmentSchema.index({ assignedTo: 1 }); // ✅ Changed from seller
appointmentSchema.index({ assignedDepartment: 1 }); // ✅ New index
appointmentSchema.index({ scheduledDateTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentNumber: 1 });
appointmentSchema.index({ createdAt: -1 });
appointmentSchema.index({ assignedTo: 1, scheduledDateTime: 1 }); // ✅ Compound index for employee schedule
appointmentSchema.index({ assignedDepartment: 1, status: 1 }); // ✅ Department performance tracking

// ✅ Pre-save middleware to generate appointment number
appointmentSchema.pre('save', async function(next) {
  if (this.isNew && !this.appointmentNumber) {
    const count = await this.constructor.countDocuments();
    this.appointmentNumber = `APP${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// ✅ Pre-save middleware to track assignment history
appointmentSchema.pre('save', async function(next) {
  if (this.isModified('assignedTo') && !this.isNew) {
    this.assignmentHistory.push({
      assignedTo: this.assignedTo,
      assignedDepartment: this.assignedDepartment,
      assignedBy: this.lastUpdatedBy,
      reason: 'Reassignment'
    });
    this.lastReassignedAt = new Date();
  }
  next();
});

// ✅ Virtual for appointment duration in hours
appointmentSchema.virtual('durationHours').get(function() {
  return this.duration / 60;
});

// ✅ Virtual for time until appointment
appointmentSchema.virtual('timeUntilAppointment').get(function() {
  const now = new Date();
  const scheduledTime = new Date(this.scheduledDateTime);
  return Math.max(0, scheduledTime - now);
});

// ✅ Instance method to check if appointment is upcoming
appointmentSchema.methods.isUpcoming = function() {
  return new Date(this.scheduledDateTime) > new Date() && this.status !== 'cancelled';
};

// ✅ Instance method to check if employee can modify
appointmentSchema.methods.canEmployeeModify = function(employeeId) {
  return this.assignedTo.toString() === employeeId.toString() && 
         ['pending', 'confirmed', 'rescheduled'].includes(this.status);
};

// ✅ Static method to get employee workload
appointmentSchema.statics.getEmployeeWorkload = function(employeeId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        assignedTo: employeeId,
        scheduledDateTime: { $gte: startDate, $lte: endDate },
        status: { $in: ['pending', 'confirmed'] }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$scheduledDateTime" } }
        },
        appointmentCount: { $sum: 1 },
        totalDuration: { $sum: "$duration" }
      }
    },
    { $sort: { "_id.date": 1 } }
  ]);
};

// ✅ Static method to get department statistics
appointmentSchema.statics.getDepartmentStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        scheduledDateTime: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: "$assignedDepartment",
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
        completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        avgDuration: { $avg: "$duration" }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

export default mongoose.model('Appointment', appointmentSchema);