// controllers/property/propertyRegistrationController.js
import PropertyRegistration from '../../models/PropertyRegistration.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import { validationResult } from 'express-validator';
import { uploadToCloudinary } from '../../utils/upload/cloudinaryService.js';
import { initiatePayment, verifyPayment } from '../../Services/paymentService.js';
import { generatePDF } from '../../utils/pdfGenerator.js';

// Helper function to generate registration number
const generateRegistrationNumber = async () => {
  try {
    const count = await PropertyRegistration.countDocuments();
    const year = new Date().getFullYear();
    const sequence = String(count + 1).padStart(6, '0');
    return `REG${year}${sequence}`;
  } catch (error) {
    // Fallback with timestamp if count fails
    const timestamp = Date.now().toString().slice(-6);
    const year = new Date().getFullYear();
    return `REG${year}${timestamp}`;
  }
};

// @desc    Submit property registration
// @route   POST /api/property-registrations
// @access  Private (Customer)
export const submitRegistration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
      });
    }

    const { propertyId, personalInfo, address, emergencyContact, financialInfo } = req.body;

    // Verify property
    const property = await Product.findById(propertyId).populate('seller');
    if (!property) {
      return res.status(404).json({ 
        success: false, 
        message: 'Property not found' 
      });
    }

    if (!property.propertyDetails?.registrationFee || property.propertyDetails.registrationFee <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Property does not require registration' 
      });
    }

    // Check for existing registration
    const existingRegistration = await PropertyRegistration.findOne({
      property: propertyId,
      customer: req.user.id,
      status: { $in: ['pending', 'approved', 'under-review'] }
    });

    if (existingRegistration) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already registered for this property' 
      });
    }

    // Generate registration number
    const registrationNumber = await generateRegistrationNumber();

    // Handle document uploads
    const documents = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResult = await uploadToCloudinary(file.path, 'registrations/documents');
          documents.push({
            type: file.fieldname,
            name: file.originalname,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
          });
        } catch (err) {
          console.error('Document upload error:', err);
        }
      }
    }

    // Handle permanent address
    if (address.permanent.sameAsCurrent) {
      address.permanent = { ...address.current, sameAsCurrent: true };
    }

    // Create registration
    const registration = await PropertyRegistration.create({
      registrationNumber,
      property: propertyId,
      customer: req.user.id,
      personalInfo,
      address,
      emergencyContact,
      financialInfo,
      documents,
      payment: {
        registrationFee: property.propertyDetails.registrationFee,
        currency: property.pricing?.currency || 'ETB',
        paymentMethod: 'chapa',
        paymentStatus: 'pending'
      }
    });

    await registration.populate([
      { path: 'property', select: 'title propertyDetails.registrationFee pricing.currency seller' },
      { path: 'customer', select: 'customerProfile email' }
    ]);

    // Initiate Chapa payment
    const paymentResponse = await initiatePayment({
      amount: property.propertyDetails.registrationFee,
      currency: property.pricing?.currency || 'ETB',
      email: personalInfo.email,
      phone: personalInfo.phone,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      callbackUrl: `${process.env.FRONTEND_URL}/registration/${registration._id}/payment-callback`,
      returnUrl: `${process.env.FRONTEND_URL}/registration/${registration._id}/payment-success`,
      customization: {
        title: 'Property Registration Fee',
        description: `Registration fee for ${property.title}`
      }
    });

    if (paymentResponse.success) {
      registration.payment.transactionId = paymentResponse.data.tx_ref;
      await registration.save();
    }

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: {
        registration,
        paymentUrl: paymentResponse.data?.checkout_url || null
      }
    });

  } catch (error) {
    console.error('Submit registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting registration'
    });
  }
};

// @desc    Verify registration payment
// @route   POST /api/property-registrations/:id/verify-payment
// @access  Private (Customer)
export const verifyRegistrationPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { tx_ref } = req.body;

    const registration = await PropertyRegistration.findById(id)
      .populate('property', 'title seller')
      .populate('customer', 'customerProfile email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Verify payment with Chapa
    const paymentVerification = await verifyPayment(tx_ref);

    if (paymentVerification.success && paymentVerification.data.status === 'success') {
      registration.payment.paymentStatus = 'completed';
      registration.payment.paymentDate = new Date();
      registration.payment.transactionId = tx_ref;
      registration.status = 'under-review';
      await registration.save();

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: { registration }
      });
    } else {
      registration.payment.paymentStatus = 'failed';
      await registration.save();
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying payment'
    });
  }
};

// @desc    Get customer registrations
// @route   GET /api/property-registrations/my-registrations
// @access  Private (Customer)
export const getMyRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { customer: req.user.id };
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    const registrations = await PropertyRegistration.find(query)
      .populate('property', 'title media.images pricing propertyDetails.location seller')
      .populate({
        path: 'property',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PropertyRegistration.countDocuments(query);

    // Get registration stats for customer
    const stats = await PropertyRegistration.aggregate([
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
        registrations,
        stats,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get my registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registrations'
    });
  }
};

// @desc    Get admin registrations (renamed from getCompanyRegistrations)
// @route   GET /api/property-registrations/admin-registrations
// @access  Private (Admin)
export const getAdminRegistrations = async (req, res) => {
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

    if (req.query.property) {
      query.property = req.query.property;
    }

    if (req.query.propertyOwner) {
      // Filter by property owner
      const ownerProperties = await Product.find({ seller: req.query.propertyOwner }).select('_id');
      query.property = { $in: ownerProperties.map(p => p._id) };
    }

    if (req.query.paymentStatus) {
      query['payment.paymentStatus'] = req.query.paymentStatus;
    }

    const registrations = await PropertyRegistration.find(query)
      .populate({
        path: 'property',
        select: 'title media.images propertyDetails.registrationFee seller',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile email'
        }
      })
      .populate('customer', 'customerProfile email')
      .populate('reviewedBy', 'companyProfile individualProfile email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PropertyRegistration.countDocuments(query);

    // Get comprehensive statistics for admin
    const stats = await PropertyRegistration.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$payment.registrationFee' }
        }
      }
    ]);

    // Get property owners who have registrations
    const propertyOwners = await PropertyRegistration.aggregate([
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
          registrationCount: { $sum: 1 },
          totalRevenue: { $sum: '$payment.registrationFee' }
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

    // Get monthly stats for the current year
    const monthlyStats = await PropertyRegistration.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$payment.registrationFee' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        registrations,
        stats,
        propertyOwners,
        monthlyStats,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get admin registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registrations'
    });
  }
};

// @desc    Update registration status
// @route   PUT /api/property-registrations/:id/status
// @access  Private (Admin)
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    // Only admins can update registration status
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const registration = await PropertyRegistration.findById(req.params.id)
      .populate({
        path: 'property',
        select: 'title seller',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile email'
        }
      })
      .populate('customer', 'customerProfile email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const oldStatus = registration.status;
    registration.status = status;
    registration.adminNotes = adminNotes || registration.adminNotes;
    registration.reviewedBy = req.user.id;
    registration.reviewedAt = new Date();

    if (status === 'approved') {
      registration.approvedAt = new Date();
    } else if (status === 'completed') {
      registration.completedAt = new Date();
    }

    await registration.save();

    res.status(200).json({
      success: true,
      message: `Registration status updated from ${oldStatus} to ${status}`,
      data: { registration }
    });

  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating registration status'
    });
  }
};

// @desc    Get registration details
// @route   GET /api/property-registrations/:id
// @access  Private (Admin/Customer)
export const getRegistrationDetails = async (req, res) => {
  try {
    const registration = await PropertyRegistration.findById(req.params.id)
      .populate({
        path: 'property',
        select: 'title media.images propertyDetails seller pricing',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile email'
        }
      })
      .populate('customer', 'customerProfile email')
      .populate('reviewedBy', 'companyProfile individualProfile email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check authorization - admin can see all, customer can see only their own
    const isAdmin = req.user.userType === 'admin';
    const isCustomer = registration.customer._id.toString() === req.user.id;

    if (!isAdmin && !isCustomer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this registration'
      });
    }

    res.status(200).json({
      success: true,
      data: { registration }
    });

  } catch (error) {
    console.error('Get registration details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registration details'
    });
  }
};

// @desc    Export registrations to CSV
// @route   GET /api/property-registrations/export-csv
// @access  Private (Admin)
export const exportRegistrationsCSV = async (req, res) => {
  try {
    // Only admins can export
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const query = {};
    
    // Apply filters if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.propertyOwner) {
      const ownerProperties = await Product.find({ seller: req.query.propertyOwner }).select('_id');
      query.property = { $in: ownerProperties.map(p => p._id) };
    }

    const registrations = await PropertyRegistration.find(query)
      .populate({
        path: 'property',
        select: 'title seller',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile'
        }
      })
      .sort({ createdAt: -1 });

    // Generate CSV content
    const csvHeader = [
      'Registration Number',
      'Property Title',
      'Property Owner',
      'Customer Name',
      'Email',
      'Phone',
      'Registration Fee',
      'Payment Status',
      'Status',
      'Registration Date',
      'Payment Date',
      'Reviewed Date',
      'Admin Notes'
    ].join(',');

    const csvRows = registrations.map(reg => [
      reg.registrationNumber,
      `"${reg.property.title}"`,
      `"${reg.property.seller.companyProfile?.companyName || 
          `${reg.property.seller.individualProfile?.firstName} ${reg.property.seller.individualProfile?.lastName}`}"`,
      `"${reg.personalInfo.firstName} ${reg.personalInfo.lastName}"`,
      reg.personalInfo.email,
      reg.personalInfo.phone,
      reg.payment.registrationFee,
      reg.payment.paymentStatus,
      reg.status,
      reg.createdAt.toISOString().split('T')[0],
      reg.payment.paymentDate ? reg.payment.paymentDate.toISOString().split('T')[0] : '',
      reg.reviewedAt ? reg.reviewedAt.toISOString().split('T')[0] : '',
      `"${reg.adminNotes || ''}"`
    ].join(','));

    const csvContent = [csvHeader, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="registrations-${new Date().toISOString().split('T')[0]}.csv"`);
    res.status(200).send(csvContent);

  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting CSV'
    });
  }
};

// @desc    Generate registration certificate
// @route   GET /api/property-registrations/:id/certificate
// @access  Private (Admin/Customer)
export const generateRegistrationCertificate = async (req, res) => {
  try {
    const registration = await PropertyRegistration.findById(req.params.id)
      .populate('property', 'title propertyDetails')
      .populate('customer', 'customerProfile')
      .populate('reviewedBy', 'companyProfile individualProfile');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Only generate certificate for approved registrations
    if (registration.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Certificate can only be generated for approved registrations'
      });
    }

    // Check authorization
    const isAdmin = req.user.userType === 'admin';
    const isCustomer = registration.customer._id.toString() === req.user.id;

    if (!isAdmin && !isCustomer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to generate certificate for this registration'
      });
    }

    // Generate PDF certificate
    const pdfBuffer = await generatePDF('registration-certificate', {
      registrationNumber: registration.registrationNumber,
      customerName: `${registration.personalInfo.firstName} ${registration.personalInfo.lastName}`,
      propertyTitle: registration.property.title,
      registrationDate: registration.createdAt,
      approvedDate: registration.approvedAt,
      reviewerName: registration.reviewedBy ? 
        (registration.reviewedBy.companyProfile?.companyName || 
         `${registration.reviewedBy.individualProfile?.firstName} ${registration.reviewedBy.individualProfile?.lastName}`) 
        : 'Admin'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="registration-certificate-${registration.registrationNumber}.pdf"`);
    res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating certificate'
    });
  }
};

// @desc    Get registration statistics
// @route   GET /api/property-registrations/stats
// @access  Private (Admin)
export const getRegistrationStats = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const period = req.query.period || '30d';
    let dateFilter = {};

    switch (period) {
      case '7d':
        dateFilter = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '90d':
        dateFilter = { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
        break;
      case '1y':
        dateFilter = { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };
        break;
      default:
        dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    const stats = await PropertyRegistration.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$payment.registrationFee' }
        }
      }
    ]);

    const totalRegistrations = await PropertyRegistration.countDocuments({ createdAt: dateFilter });
    const totalRevenue = await PropertyRegistration.aggregate([
      { $match: { createdAt: dateFilter, 'payment.paymentStatus': 'completed' } },
      { $group: { _id: null, total: { $sum: '$payment.registrationFee' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats,
        totalRegistrations,
        totalRevenue: totalRevenue[0]?.total || 0,
        period
      }
    });

  } catch (error) {
    console.error('Get registration stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registration statistics'
    });
  }
};