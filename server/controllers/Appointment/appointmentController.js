// controllers/property/appointmentController.js
import Appointment from '../../models/Appointment.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import { validationResult } from 'express-validator';
import { sendNotification } from '../../services/notificationService.js';
// import { sendEmail } from '../../services/emailService.js';
import { scheduleNotification } from '../../services/notificationScheduler.js';
import { sendEmail } from '../../utils/email/emailService.js';

// @desc    Book appointment
// @route   POST /api/appointments
// @access  Private (Customer)
export const bookAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      propertyId,
      contactInfo,
      scheduledDateTime,
      appointmentType,
      meetingDetails,
      customerNotes
    } = req.body;

    // Verify property exists
    const property = await Product.findById(propertyId).populate('seller');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if property allows viewings
    if (!property.viewingDetails?.allowViewings) {
      return res.status(400).json({
        success: false,
        message: 'This property does not allow viewings'
      });
    }

    // Validate appointment time
    const appointmentDate = new Date(scheduledDateTime);
    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date must be in the future'
      });
    }

    // Check for conflicts (same seller, overlapping time)
    const conflictingAppointment = await Appointment.findOne({
      seller: property.seller._id,
      scheduledDateTime: {
        $gte: new Date(appointmentDate.getTime() - 60 * 60 * 1000), // 1 hour before
        $lte: new Date(appointmentDate.getTime() + 60 * 60 * 1000)  // 1 hour after
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'The selected time conflicts with another appointment'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      property: propertyId,
      customer: req.user.id,
      seller: property.seller._id,
      contactInfo,
      scheduledDateTime: appointmentDate,
      appointmentType,
      meetingDetails,
      customerNotes
    });

    await appointment.populate([
      { path: 'property', select: 'title media.images propertyDetails.location' },
      { path: 'customer', select: 'firstName lastName email' },
      { path: 'seller', select: 'companyProfile individualProfile email' }
    ]);

    // Send notifications
    await sendNotification(property.seller._id, {
      type: 'new_appointment',
      title: 'New Appointment Request',
      message: `${contactInfo.name} requested an appointment for ${property.title}`,
      data: { appointmentId: appointment._id, propertyId }
    });

    // Send confirmation email to customer
    await sendEmail({
      to: contactInfo.email,
      subject: `Appointment Request Submitted - ${property.title}`,
      template: 'appointment-request',
      data: {
        customerName: contactInfo.name,
        propertyTitle: property.title,
        appointmentDate: appointmentDate.toLocaleDateString(),
        appointmentTime: appointmentDate.toLocaleTimeString(),
        appointmentNumber: appointment.appointmentNumber
      }
    });

    // Schedule reminder notification (24 hours before)
    const reminderTime = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
    if (reminderTime > new Date()) {
      await scheduleNotification({
        userId: req.user.id,
        scheduledFor: reminderTime,
        type: 'appointment_reminder',
        title: 'Appointment Reminder',
        message: `You have an appointment tomorrow for ${property.title}`,
        data: { appointmentId: appointment._id }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: { appointment }
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while booking appointment'
    });
  }
};

// @desc    Get customer appointments
// @route   GET /api/appointments/my-appointments
// @access  Private (Customer)
export const getMyAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { customer: req.user.id };
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.upcoming === 'true') {
      query.scheduledDateTime = { $gte: new Date() };
    }

    const appointments = await Appointment.find(query)
      .populate('property', 'title media.images propertyDetails.location pricing')
      .populate('seller', 'companyProfile individualProfile email')
      .sort({ scheduledDateTime: req.query.upcoming === 'true' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        appointments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get my appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
};

// @desc    Get seller appointments
// @route   GET /api/appointments/seller-appointments
// @access  Private (Seller)
export const getSellerAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { seller: req.user.id };
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.date) {
      const startDate = new Date(req.query.date);
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      query.scheduledDateTime = { $gte: startDate, $lt: endDate };
    }

    if (req.query.property) {
      query.property = req.query.property;
    }

    const appointments = await Appointment.find(query)
      .populate('property', 'title media.images propertyDetails.location')
      .populate('customer', 'firstName lastName email avatar')
      .sort({ scheduledDateTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    // Get today's appointments count
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));
    
    const todayCount = await Appointment.countDocuments({
      seller: req.user.id,
      scheduledDateTime: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ['pending', 'confirmed'] }
    });

    res.status(200).json({
      success: true,
      data: {
        appointments,
        todayCount,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get seller appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Seller)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, sellerNotes, outcome } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate('property', 'title seller')
      .populate('customer', 'firstName lastName email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (appointment.seller.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    const oldStatus = appointment.status;
    appointment.status = status;
    appointment.sellerNotes = sellerNotes || appointment.sellerNotes;

    if (outcome) {
      appointment.outcome = { ...appointment.outcome, ...outcome };
    }

    if (status === 'confirmed') {
      appointment.confirmedAt = new Date();
    } else if (status === 'completed') {
      appointment.completedAt = new Date();
    } else if (status === 'cancelled') {
      appointment.cancelledAt = new Date();
    }

    await appointment.save();

    // Send notification to customer
    const statusMessages = {
      'confirmed': 'Your appointment has been confirmed!',
      'cancelled': 'Your appointment has been cancelled.',
      'completed': 'Your appointment has been completed.',
      'rescheduled': 'Your appointment has been rescheduled.'
    };

    await sendNotification(appointment.customer._id, {
      type: 'appointment_status_update',
      title: 'Appointment Status Updated',
      message: statusMessages[status] || `Appointment status updated to ${status}`,
      data: { appointmentId: appointment._id, status }
    });

    // Send email notification
    await sendEmail({
      to: appointment.customer.email,
      subject: `Appointment ${status} - ${appointment.property.title}`,
      template: 'appointment-status-update',
      data: {
        customerName: `${appointment.customer.firstName} ${appointment.customer.lastName}`,
        propertyTitle: appointment.property.title,
        status,
        sellerNotes,
        appointmentNumber: appointment.appointmentNumber,
        appointmentDate: appointment.scheduledDateTime.toLocaleDateString(),
        appointmentTime: appointment.scheduledDateTime.toLocaleTimeString()
      }
    });

    res.status(200).json({
      success: true,
      message: `Appointment status updated from ${oldStatus} to ${status}`,
      data: { appointment }
    });

  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating appointment status'
    });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (Customer/Seller)
export const rescheduleAppointment = async (req, res) => {
  try {
    const { newDateTime, reason } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate('property', 'title')
      .populate('customer', 'firstName lastName email')
      .populate('seller', 'companyProfile individualProfile email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    const isCustomer = appointment.customer._id.toString() === req.user.id;
    const isSeller = appointment.seller._id.toString() === req.user.id;

    if (!isCustomer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reschedule this appointment'
      });
    }

    const newDate = new Date(newDateTime);
    if (newDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'New appointment date must be in the future'
      });
    }

    // Add to rescheduling history
    appointment.reschedulingHistory.push({
      originalDate: appointment.scheduledDateTime,
      newDate: newDate,
      reason,
      rescheduledBy: isCustomer ? 'customer' : 'seller'
    });

    appointment.scheduledDateTime = newDate;
    appointment.status = 'rescheduled';
    await appointment.save();

    // Notify the other party
    const recipientId = isCustomer ? appointment.seller._id : appointment.customer._id;
    const recipientEmail = isCustomer ? 
      (appointment.seller.companyProfile?.email || appointment.seller.email) :
      appointment.customer.email;

    await sendNotification(recipientId, {
      type: 'appointment_rescheduled',
      title: 'Appointment Rescheduled',
      message: `Appointment for ${appointment.property.title} has been rescheduled`,
      data: { appointmentId: appointment._id }
    });

    await sendEmail({
      to: recipientEmail,
      subject: `Appointment Rescheduled - ${appointment.property.title}`,
      template: 'appointment-reschedule',
      data: {
        propertyTitle: appointment.property.title,
        oldDate: appointment.reschedulingHistory[appointment.reschedulingHistory.length - 1].originalDate.toLocaleDateString(),
        newDate: newDate.toLocaleDateString(),
        newTime: newDate.toLocaleTimeString(),
        reason,
        rescheduledBy: isCustomer ? 'customer' : 'property owner'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: { appointment }
    });

  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rescheduling appointment'
    });
  }
};

