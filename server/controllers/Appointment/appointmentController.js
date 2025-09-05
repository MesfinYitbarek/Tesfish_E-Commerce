// controllers/Appointment/appointmentController.js
import Appointment from '../../models/Appointment.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import { validationResult } from 'express-validator';

// Helper function to get available admin for appointment assignment
const getAvailableAdmin = async (scheduledDateTime) => {
  try {
    // Get all admin users
    const admins = await User.find({ userType: 'admin', isActive: true });
    
    if (admins.length === 0) {
      throw new Error('No admin users available');
    }

    // Simple round-robin assignment - get admin with least appointments for that day
    const appointmentDate = new Date(scheduledDateTime);
    const dayStart = new Date(appointmentDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(appointmentDate.setHours(23, 59, 59, 999));

    const adminAppointmentCounts = await Promise.all(
      admins.map(async (admin) => {
        const count = await Appointment.countDocuments({
          seller: admin._id,
          scheduledDateTime: { $gte: dayStart, $lte: dayEnd },
          status: { $in: ['pending', 'confirmed'] }
        });
        return { admin, count };
      })
    );

    // Sort by appointment count (ascending) and return admin with least appointments
    adminAppointmentCounts.sort((a, b) => a.count - b.count);
    return adminAppointmentCounts[0].admin;
  } catch (error) {
    // Fallback to first admin
    const firstAdmin = await User.findOne({ userType: 'admin', isActive: true });
    return firstAdmin;
  }
};

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
      appointmentType = 'property-viewing',
      meetingDetails,
      customerNotes
    } = req.body;

    // Verify property exists (seller can be company/individual)
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

    // Check business hours if defined
    const hour = appointmentDate.getHours();
    if (property.viewingDetails?.businessHours) {
      const { startTime, endTime } = property.viewingDetails.businessHours;
      if (hour < startTime || hour >= endTime) {
        return res.status(400).json({
          success: false,
          message: `Appointments are only available between ${startTime}:00 and ${endTime}:00`
        });
      }
    }

    // Get available admin to handle this appointment
    const assignedAdmin = await getAvailableAdmin(appointmentDate);
    if (!assignedAdmin) {
      return res.status(500).json({
        success: false,
        message: 'No admin available to handle appointment. Please try again later.'
      });
    }

    // Check for conflicts with assigned admin
    const conflictingAppointment = await Appointment.findOne({
      seller: assignedAdmin._id,
      scheduledDateTime: {
        $gte: new Date(appointmentDate.getTime() - 60 * 60 * 1000), // 1 hour before
        $lte: new Date(appointmentDate.getTime() + 60 * 60 * 1000)  // 1 hour after
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'The selected time is not available. Please choose a different time.'
      });
    }

    // Set default meeting details
    const defaultMeetingDetails = {
      location: 'property-site',
      address: property.propertyDetails?.location?.street || 'Property Location',
      ...meetingDetails
    };

    // Create appointment (seller field points to admin, not property owner)
    const appointment = await Appointment.create({
      property: propertyId,
      customer: req.user.id,
      seller: assignedAdmin._id, // Admin handles the appointment
      contactInfo,
      scheduledDateTime: appointmentDate,
      appointmentType,
      meetingDetails: defaultMeetingDetails,
      customerNotes
    });

    await appointment.populate([
      { path: 'property', select: 'title media.images propertyDetails.location seller' },
      { path: 'customer', select: 'customerProfile email' },
      { path: 'seller', select: 'companyProfile individualProfile email' }
    ]);

    const adminEmail = assignedAdmin.companyProfile?.email || 
                      assignedAdmin.individualProfile?.email || 
                      assignedAdmin.email;

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: { 
        appointment,
        assignedAdmin: {
          id: assignedAdmin._id,
          name: assignedAdmin.companyProfile?.companyName || 
                `${assignedAdmin.individualProfile?.firstName} ${assignedAdmin.individualProfile?.lastName}`,
          email: adminEmail
        }
      }
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

    if (req.query.past === 'true') {
      query.scheduledDateTime = { $lt: new Date() };
    }

    const appointments = await Appointment.find(query)
      .populate('property', 'title media.images propertyDetails.location pricing seller')
      .populate({
        path: 'property',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile'
        }
      })
      .populate('seller', 'companyProfile individualProfile email') // Admin who handles appointment
      .sort({ scheduledDateTime: req.query.upcoming === 'true' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    // Get appointment stats for customer
    const stats = await Appointment.aggregate([
      { $match: { customer: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        appointments,
        stats,
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

// @desc    Get admin appointments (renamed from getSellerAppointments)
// @route   GET /api/appointments/admin-appointments
// @access  Private (Admin)
export const getAdminAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only admins can access this
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const query = { seller: req.user.id }; // seller field contains admin ID
    
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

    if (req.query.upcoming === 'true') {
      query.scheduledDateTime = { $gte: new Date() };
    }

    if (req.query.propertyOwner) {
      // Filter by property owner
      const ownerProperties = await Product.find({ seller: req.query.propertyOwner }).select('_id');
      query.property = { $in: ownerProperties.map(p => p._id) };
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'property',
        select: 'title media.images propertyDetails.location seller',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile email'
        }
      })
      .populate('customer', 'customerProfile email')
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

    // Get upcoming appointments count (next 7 days)
    const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const upcomingCount = await Appointment.countDocuments({
      seller: req.user.id,
      scheduledDateTime: { $gte: new Date(), $lte: weekEnd },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Get property owners who have appointments with this admin
    const propertyOwners = await Appointment.aggregate([
      { $match: { seller: req.user._id } },
      {
        $lookup: {
          from: 'products',
          localField: 'property',
          foreignField: '_id',
          as: 'propertyDetails'
        }
      },
      { $unwind: '$propertyDetails' },
      {
        $group: {
          _id: '$propertyDetails.seller',
          appointmentCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'ownerDetails'
        }
      },
      { $unwind: '$ownerDetails' }
    ]);

    res.status(200).json({
      success: true,
      data: {
        appointments,
        todayCount,
        upcomingCount,
        propertyOwners,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get admin appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Admin)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, sellerNotes, outcome } = req.body;

    // Only admins can update appointment status
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'property',
        select: 'title seller',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile email'
        }
      })
      .populate('customer', 'customerProfile email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if this admin is assigned to handle this appointment
    if (appointment.seller.toString() !== req.user.id) {
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

// @desc    Assign appointment to different admin
// @route   PUT /api/appointments/:id/assign
// @access  Private (Admin)
export const assignAppointmentToAdmin = async (req, res) => {
  try {
    const { adminId, reason } = req.body;

    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('property', 'title')
      .populate('customer', 'customerProfile email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify target admin exists
    const targetAdmin = await User.findOne({ _id: adminId, userType: 'admin' });
    if (!targetAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Target admin not found'
      });
    }

    const oldAdminId = appointment.seller;
    appointment.seller = adminId;
    appointment.sellerNotes = `${appointment.sellerNotes || ''}\n\nReassigned: ${reason || 'No reason provided'}`.trim();
    
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment reassigned successfully',
      data: { appointment }
    });

  } catch (error) {
    console.error('Assign appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning appointment'
    });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (Customer/Admin)
export const rescheduleAppointment = async (req, res) => {
  try {
    const { newDateTime, reason } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate('property', 'title seller')
      .populate('customer', 'customerProfile email')
      .populate('seller', 'companyProfile individualProfile email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization - either customer or assigned admin
    const isCustomer = appointment.customer._id.toString() === req.user.id;
    const isAssignedAdmin = appointment.seller._id.toString() === req.user.id && req.user.userType === 'admin';

    if (!isCustomer && !isAssignedAdmin) {
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

    // Check for conflicts with assigned admin
    const conflictingAppointment = await Appointment.findOne({
      seller: appointment.seller._id,
      scheduledDateTime: {
        $gte: new Date(newDate.getTime() - 60 * 60 * 1000),
        $lte: new Date(newDate.getTime() + 60 * 60 * 1000)
      },
      status: { $in: ['pending', 'confirmed'] },
      _id: { $ne: appointment._id }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'The selected time conflicts with another appointment'
      });
    }

    // Add to rescheduling history
    appointment.reschedulingHistory.push({
      originalDate: appointment.scheduledDateTime,
      newDate: newDate,
      reason,
      rescheduledBy: isCustomer ? 'customer' : 'admin'
    });

    appointment.scheduledDateTime = newDate;
    appointment.status = 'rescheduled';
    await appointment.save();

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

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats
// @access  Private (Admin)
export const getAppointmentStats = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const stats = await Appointment.aggregate([
      { $match: { seller: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Appointment.aggregate([
      { 
        $match: { 
          seller: req.user._id,
          scheduledDateTime: {
            $gte: new Date(new Date().getFullYear(), 0, 1) // Start of current year
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$scheduledDateTime' },
            year: { $year: '$scheduledDateTime' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusStats: stats,
        monthlyStats
      }
    });

  } catch (error) {
    console.error('Get appointment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointment statistics'
    });
  }
};

// @desc    Export appointments to CSV
// @route   GET /api/appointments/export-csv
// @access  Private (Admin)
export const exportAppointmentsCSV = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const appointments = await Appointment.find({ seller: req.user.id })
      .populate('property', 'title propertyDetails.location')
      .populate('customer', 'customerProfile email')
      .populate({
        path: 'property',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile'
        }
      })
      .sort({ createdAt: -1 });

    // Generate CSV content
    const csvHeader = [
      'Appointment Number',
      'Property Title',
      'Property Owner',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Appointment Date',
      'Appointment Time',
      'Status',
      'Type',
      'Meeting Location',
      'Created Date'
    ].join(',');

    const csvRows = appointments.map(appt => [
      appt.appointmentNumber,
      `"${appt.property.title}"`,
      `"${appt.property.seller.companyProfile?.companyName || 
          `${appt.property.seller.individualProfile?.firstName} ${appt.property.seller.individualProfile?.lastName}`}"`,
      `"${appt.contactInfo.name}"`,
      appt.contactInfo.email,
      appt.contactInfo.phone,
      appt.scheduledDateTime.toLocaleDateString(),
      appt.scheduledDateTime.toLocaleTimeString(),
      appt.status,
      appt.appointmentType,
      appt.meetingDetails.location,
      appt.createdAt.toLocaleDateString()
    ].join(','));

    const csvContent = [csvHeader, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="appointments-${new Date().toISOString().split('T')[0]}.csv"`);
    res.status(200).send(csvContent);

  } catch (error) {
    console.error('Export appointments CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting appointments'
    });
  }
};