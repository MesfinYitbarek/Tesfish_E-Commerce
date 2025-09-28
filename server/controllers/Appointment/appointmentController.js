// controllers/Appointment/appointmentController.js
import Appointment from '../../models/Appointment.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import { validationResult } from 'express-validator';

// ✅ Helper function to get available employee for appointment assignment
const getAvailableEmployee = async (scheduledDateTime, department = null) => {
  try {
    // Get active employees (optionally filter by department)
    const employeeQuery = { 
      userType: 'employee', 
      isActive: true,
      'employeeProfile.employmentStatus': 'active'
    };

    // If specific department requested, filter by it
    if (department) {
      employeeQuery['employeeProfile.department'] = department;
    }

    const employees = await User.find(employeeQuery);
    
    if (employees.length === 0) {
      throw new Error('No employees available');
    }

    // Simple round-robin assignment - get employee with least appointments for that day
    const appointmentDate = new Date(scheduledDateTime);
    const dayStart = new Date(appointmentDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(appointmentDate.setHours(23, 59, 59, 999));

    const employeeAppointmentCounts = await Promise.all(
      employees.map(async (employee) => {
        const count = await Appointment.countDocuments({
          assignedTo: employee._id,
          scheduledDateTime: { $gte: dayStart, $lte: dayEnd },
          status: { $in: ['pending', 'confirmed'] }
        });
        return { employee, count };
      })
    );

    // Sort by appointment count (ascending) and return employee with least appointments
    employeeAppointmentCounts.sort((a, b) => a.count - b.count);
    return employeeAppointmentCounts[0].employee;
  } catch (error) {
    // Fallback to any available employee
    const firstEmployee = await User.findOne({ 
      userType: 'employee', 
      isActive: true,
      'employeeProfile.employmentStatus': 'active'
    });
    return firstEmployee;
  }
};

// ✅ Helper function to determine appropriate department for appointment
const determineAppointmentDepartment = (appointmentType) => {
  const departmentMapping = {
    'property-viewing': 'real-estate',
    'consultation': 'real-estate',
    'property-evaluation': 'real-estate',
    'contract-discussion': 'real-estate',
    'design-consultation': 'interior-design',
    'project-meeting': 'project-management',
    'engineering-consultation': 'engineering'
  };
  
  return departmentMapping[appointmentType] || 'real-estate'; // Default to real estate
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
      customerNotes,
      preferredDepartment
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

    // ✅ Determine department and get available employee
    const targetDepartment = preferredDepartment || determineAppointmentDepartment(appointmentType);
    const assignedEmployee = await getAvailableEmployee(appointmentDate, targetDepartment);
    
    if (!assignedEmployee) {
      return res.status(500).json({
        success: false,
        message: 'No employee available to handle appointment. Please try again later.'
      });
    }

    // Check for conflicts with assigned employee
    const conflictingAppointment = await Appointment.findOne({
      assignedTo: assignedEmployee._id,
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

    // ✅ Create appointment (assignedTo field points to employee)
    const appointment = await Appointment.create({
      property: propertyId,
      customer: req.user.id,
      assignedTo: assignedEmployee._id, // Employee handles the appointment
      contactInfo,
      scheduledDateTime: appointmentDate,
      appointmentType,
      meetingDetails: defaultMeetingDetails,
      customerNotes,
      assignedDepartment: targetDepartment
    });

    await appointment.populate([
      { path: 'property', select: 'title media.images propertyDetails.location seller' },
      { path: 'customer', select: 'customerProfile email' },
      { path: 'assignedTo', select: 'employeeProfile email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: { 
        appointment,
        assignedEmployee: {
          id: assignedEmployee._id,
          name: `${assignedEmployee.employeeProfile?.firstName} ${assignedEmployee.employeeProfile?.lastName}`,
          email: assignedEmployee.email,
          department: assignedEmployee.employeeProfile?.department,
          position: assignedEmployee.employeeProfile?.position
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
      .populate('assignedTo', 'employeeProfile email') // Employee who handles appointment
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

// ✅ @desc    Get employee appointments
// @route   GET /api/appointments/my-assignments
// @access  Private (Employee)
export const getMyAssignments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only employees can access this
    if (req.user.userType !== 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee role required.'
      });
    }

    const query = { assignedTo: req.user.id };
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.date) {
      const startDate = new Date(req.query.date);
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      query.scheduledDateTime = { $gte: startDate, $lt: endDate };
    }

    if (req.query.upcoming === 'true') {
      query.scheduledDateTime = { $gte: new Date() };
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
      assignedTo: req.user.id,
      scheduledDateTime: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Get upcoming appointments count (next 7 days)
    const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const upcomingCount = await Appointment.countDocuments({
      assignedTo: req.user.id,
      scheduledDateTime: { $gte: new Date(), $lte: weekEnd },
      status: { $in: ['pending', 'confirmed'] }
    });

    res.status(200).json({
      success: true,
      data: {
        appointments,
        todayCount,
        upcomingCount,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get employee assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching assignments'
    });
  }
};

// ✅ @desc    Get all appointments (Admin oversight)
// @route   GET /api/appointments/admin-overview
// @access  Private (Admin)
export const getAdminOverview = async (req, res) => {
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

    const query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    if (req.query.department) {
      query.assignedDepartment = req.query.department;
    }

    if (req.query.date) {
      const startDate = new Date(req.query.date);
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      query.scheduledDateTime = { $gte: startDate, $lt: endDate };
    }

    if (req.query.upcoming === 'true') {
      query.scheduledDateTime = { $gte: new Date() };
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
      .populate('assignedTo', 'employeeProfile email')
      .sort({ scheduledDateTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    // Get department statistics
    const departmentStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$assignedDepartment',
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      }
    ]);

    // Get employee workload
    const employeeWorkload = await Appointment.aggregate([
      {
        $match: {
          scheduledDateTime: { $gte: new Date() },
          status: { $in: ['pending', 'confirmed'] }
        }
      },
      {
        $group: {
          _id: '$assignedTo',
          appointmentCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      {
        $project: {
          employeeName: {
            $concat: ['$employee.employeeProfile.firstName', ' ', '$employee.employeeProfile.lastName']
          },
          department: '$employee.employeeProfile.department',
          appointmentCount: 1
        }
      },
      { $sort: { appointmentCount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        appointments,
        departmentStats,
        employeeWorkload,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get admin overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin overview'
    });
  }
};

// ✅ @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Employee/Admin)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes, outcome } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'property',
        select: 'title seller',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile email'
        }
      })
      .populate('customer', 'customerProfile email')
      .populate('assignedTo', 'employeeProfile email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization - assigned employee or admin
    const isAssignedEmployee = appointment.assignedTo._id.toString() === req.user.id && req.user.userType === 'employee';
    const isAdmin = req.user.userType === 'admin';

    if (!isAssignedEmployee && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    const oldStatus = appointment.status;
    appointment.status = status;
    appointment.employeeNotes = notes || appointment.employeeNotes;

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

    // Track who made the update
    appointment.lastUpdatedBy = req.user.id;
    appointment.lastUpdatedByType = req.user.userType;

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

// ✅ @desc    Reassign appointment to different employee
// @route   PUT /api/appointments/:id/reassign
// @access  Private (Admin)
export const reassignAppointment = async (req, res) => {
  try {
    const { employeeId, reason } = req.body;

    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('property', 'title')
      .populate('customer', 'customerProfile email')
      .populate('assignedTo', 'employeeProfile email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify target employee exists
    const targetEmployee = await User.findOne({ 
      _id: employeeId, 
      userType: 'employee',
      'employeeProfile.employmentStatus': 'active'
    });
    
    if (!targetEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Target employee not found or not active'
      });
    }

    // Check for scheduling conflicts
    const conflictingAppointment = await Appointment.findOne({
      assignedTo: employeeId,
      scheduledDateTime: {
        $gte: new Date(appointment.scheduledDateTime.getTime() - 60 * 60 * 1000),
        $lte: new Date(appointment.scheduledDateTime.getTime() + 60 * 60 * 1000)
      },
      status: { $in: ['pending', 'confirmed'] },
      _id: { $ne: appointment._id }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Target employee has a conflicting appointment at this time'
      });
    }

    const oldEmployeeId = appointment.assignedTo._id;
    appointment.assignedTo = employeeId;
    appointment.assignedDepartment = targetEmployee.employeeProfile.department;
    appointment.employeeNotes = `${appointment.employeeNotes || ''}\n\nReassigned from ${appointment.assignedTo.employeeProfile?.firstName} ${appointment.assignedTo.employeeProfile?.lastName}: ${reason || 'No reason provided'}`.trim();
    appointment.lastUpdatedBy = req.user.id;
    appointment.lastUpdatedByType = 'admin';
    
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment reassigned successfully',
      data: { 
        appointment,
        newAssignee: {
          id: targetEmployee._id,
          name: `${targetEmployee.employeeProfile.firstName} ${targetEmployee.employeeProfile.lastName}`,
          department: targetEmployee.employeeProfile.department
        }
      }
    });

  } catch (error) {
    console.error('Reassign appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while reassigning appointment'
    });
  }
};

// ✅ @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (Customer/Employee/Admin)
export const rescheduleAppointment = async (req, res) => {
  try {
    const { newDateTime, reason } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate('property', 'title seller')
      .populate('customer', 'customerProfile email')
      .populate('assignedTo', 'employeeProfile email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization - customer, assigned employee, or admin
    const isCustomer = appointment.customer._id.toString() === req.user.id;
    const isAssignedEmployee = appointment.assignedTo._id.toString() === req.user.id && req.user.userType === 'employee';
    const isAdmin = req.user.userType === 'admin';

    if (!isCustomer && !isAssignedEmployee && !isAdmin) {
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

    // Check for conflicts with assigned employee
    const conflictingAppointment = await Appointment.findOne({
      assignedTo: appointment.assignedTo._id,
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
      rescheduledBy: req.user.userType,
      rescheduledById: req.user.id
    });

    appointment.scheduledDateTime = newDate;
    appointment.status = 'rescheduled';
    appointment.lastUpdatedBy = req.user.id;
    appointment.lastUpdatedByType = req.user.userType;
    
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

// ✅ @desc    Get appointment statistics (Employee/Admin)
// @route   GET /api/appointments/stats
// @access  Private (Employee/Admin)
export const getAppointmentStats = async (req, res) => {
  try {
    let query = {};

    if (req.user.userType === 'employee') {
      // Employee sees only their assignments
      query.assignedTo = req.user._id;
    } else if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee or Admin role required.'
      });
    }
    // Admin sees all appointments (empty query)

    const statusStats = await Appointment.aggregate([
      { $match: query },
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
          ...query,
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

    // Department stats (only for admin)
    let departmentStats = [];
    if (req.user.userType === 'admin') {
      departmentStats = await Appointment.aggregate([
        {
          $group: {
            _id: '$assignedDepartment',
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
          }
        }
      ]);
    }

    res.status(200).json({
      success: true,
      data: {
        statusStats,
        monthlyStats,
        departmentStats
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

// ✅ @desc    Export appointments to CSV
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

    const appointments = await Appointment.find({})
      .populate('property', 'title propertyDetails.location')
      .populate('customer', 'customerProfile email')
      .populate('assignedTo', 'employeeProfile email')
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
      'Assigned Employee',
      'Employee Department',
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
      `"${appt.assignedTo.employeeProfile?.firstName} ${appt.assignedTo.employeeProfile?.lastName}"`,
      appt.assignedDepartment || '',
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