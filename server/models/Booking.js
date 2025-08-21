import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Basic Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  
  // Booking Details
  bookingType: {
    type: String,
    enum: ['property-viewing', 'consultation', 'service-booking', 'meeting'],
    required: true
  },
  
  // Scheduling
  appointmentDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  timeSlot: {
    start: String, // "09:00"
    end: String    // "10:00"
  },
  
  // Customer Information
  customerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    requirements: String,
    groupSize: {
      type: Number,
      default: 1
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  
  // Payment
  registrationFee: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  
  // Location
  location: {
    type: String,
    enum: ['on-site', 'virtual', 'office'],
    default: 'on-site'
  },
  address: String,
  meetingLink: String,
  
  // Notes
  customerNotes: String,
  sellerNotes: String,
  
  // Reminders
  remindersSent: [{
    type: String,
    timestamp: Date
  }]
}, {
  timestamps: true
});

bookingSchema.index({ customer: 1 });
bookingSchema.index({ seller: 1 });
bookingSchema.index({ appointmentDate: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.model('Booking', bookingSchema);