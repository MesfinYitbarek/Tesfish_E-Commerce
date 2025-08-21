import Booking from '../../models/Booking.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import { sendEmail } from '../../utils/email/emailService.js';

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      seller,
      product,
      bookingType,
      appointmentDate,
      duration,
      customerInfo,
      requirements,
      location,
      address,
      registrationFee
    } = req.body;

    // Validate seller exists
    const sellerUser = await User.findById(seller);
    if (!sellerUser) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Validate product if provided
    let productData = null;
    if (product) {
      productData = await Product.findById(product);
      if (!productData) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
    }

    // Check if appointment slot is available
    const appointmentStart = new Date(appointmentDate);
    const appointmentEnd = new Date(appointmentStart.getTime() + (duration || 60) * 60000);

    const conflictingBooking = await Booking.findOne({
      seller,
      appointmentDate: {
        $gte: appointmentStart,
        $lt: appointmentEnd
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is not available'
      });
    }

    // Create booking
    const bookingData = {
      customer: req.user.id,
      seller,
      product,
      bookingType,
      appointmentDate: appointmentStart,
      duration: duration || 60,
      customerInfo: customerInfo || {
        firstName: req.user.customerProfile?.firstName,
        lastName: req.user.customerProfile?.lastName,
        email: req.user.email,
        phone: req.user.customerProfile?.phone
      },
      location,
      address,
      registrationFee
    };

    const booking = await Booking.create(bookingData);

    // Send confirmation emails
    await Promise.all([
      // Email to customer
      sendEmail({
        to: bookingData.customerInfo.email,
        subject: 'Booking Confirmation - CitiLights',
        template: 'bookingConfirmation',
        data: {
          customerName: `${bookingData.customerInfo.firstName} ${bookingData.customerInfo.lastName}`,
          appointmentDate: appointmentStart.toLocaleDateString(),
          appointmentTime: appointmentStart.toLocaleTimeString(),
          sellerName: sellerUser.fullName,
          bookingType
        }
      }),
      // Email to seller
      sendEmail({
        to: sellerUser.email,
        subject: 'New Booking Request - CitiLights',
        template: 'newBookingNotification',
        data: {
          sellerName: sellerUser.fullName,
          customerName: `${bookingData.customerInfo.firstName} ${bookingData.customerInfo.lastName}`,
          appointmentDate: appointmentStart.toLocaleDateString(),
          appointmentTime: appointmentStart.toLocaleTimeString(),
          bookingType
        }
      })
    ]);

    const populatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'customerProfile email')
      .populate('seller', 'companyProfile individualProfile email')
      .populate('product', 'title media');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking: populatedBooking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { customer: req.user.id };

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Date filter
    if (req.query.upcoming) {
      query.appointmentDate = { $gte: new Date() };
    }

    const bookings = await Booking.find(query)
      .populate('seller', 'companyProfile individualProfile email')
      .populate('product', 'title media')
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBookings: total
        }
      }
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

// @desc    Get seller's bookings
// @route   GET /api/bookings/seller/bookings
// @access  Private (Sellers only)
export const getSellerBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { seller: req.user.id };

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Date filter
    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      query.appointmentDate = {
        $gte: date,
        $lt: nextDay
      };
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'customerProfile email')
      .populate('product', 'title media')
      .sort({ appointmentDate: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBookings: total
        }
      }
    });
  } catch (error) {
    console.error('Get seller bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching seller bookings'
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, sellerNotes } = req.body;
    
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'customerProfile email')
      .populate('seller', 'companyProfile individualProfile email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const isSeller = booking.seller._id.toString() === req.user.id;
    const isCustomer = booking.customer._id.toString() === req.user.id;
    const isAdmin = req.user.userType === 'admin';

    if (!isSeller && !isCustomer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Validate status transitions
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled', 'no-show'],
      cancelled: [],
      completed: [],
      'no-show': []
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${status}`
      });
    }

    booking.status = status;
    if (sellerNotes) booking.sellerNotes = sellerNotes;
    await booking.save();

    // Send status update email
    await sendEmail({
      to: booking.customerInfo.email,
      subject: `Booking Update - ${booking._id}`,
      template: 'bookingStatusUpdate',
      data: {
        customerName: `${booking.customerInfo.firstName} ${booking.customerInfo.lastName}`,
        status,
        appointmentDate: booking.appointmentDate.toLocaleDateString(),
        sellerName: booking.seller.fullName,
        sellerNotes
      }
    });

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
};

// @desc    Get available time slots
// @route   GET /api/bookings/available-slots/:sellerId
// @access  Public
export const getAvailableSlots = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { date, duration = 60 } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    // Get business hours for the day
    const businessHours = seller.companyProfile?.businessHours?.[dayOfWeek];
    if (!businessHours || businessHours.closed) {
      return res.status(200).json({
        success: true,
        data: { availableSlots: [] }
      });
    }

    // Get existing bookings for the date
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);

    const existingBookings = await Booking.find({
      seller: sellerId,
      appointmentDate: {
        $gte: selectedDate,
        $lt: nextDay
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Generate time slots
    const slots = [];
    const startTime = businessHours.open;
    const endTime = businessHours.close;
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentTime = new Date(selectedDate);
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    while (currentTime < endDateTime) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);
      
      // Check if slot conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => {
        const bookingStart = new Date(booking.appointmentDate);
        const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
        
        return (currentTime < bookingEnd && slotEnd > bookingStart);
      });

      if (!hasConflict && slotEnd <= endDateTime) {
        slots.push({
          start: currentTime.toISOString(),
          end: slotEnd.toISOString(),
          available: true
        });
      }

      // Move to next 30-minute slot
      currentTime.setTime(currentTime.getTime() + 30 * 60000);
    }

    res.status(200).json({
      success: true,
      data: { availableSlots: slots }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available slots'
    });
  }
};