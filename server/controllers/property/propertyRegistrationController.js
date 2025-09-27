// controllers/property/propertyRegistrationController.js
import PropertyRegistration from '../../models/PropertyRegistration.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import { validationResult } from 'express-validator';
import { uploadToCloudinary } from '../../utils/upload/cloudinaryService.js';
import { initiatePayment, verifyPayment } from '../../Services/paymentService.js';
import { generatePDF } from '../../utils/pdfGenerator.js';
import { generateTxRef } from '../../Services/chapaService.js';
import Payment from '../../models/Payment.js';
import { initiateChapa, verifyChapa } from '../../Services/chapaService.js';

/**
 * Submit registration (create registration + payment initiation)
 */
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

/**
 * Submit registration (create registration + payment initiation)
 */
export const submitRegistration = async (req, res) => {
  try {
    console.log('=== Property Registration Submission ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files?.length || 0);

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({ 
          field: err.path || err.param, 
          message: err.msg,
          value: err.value 
        }))
      });
    }

    const { propertyId, personalInfo, address, emergencyContact, financialInfo } = req.body;

    console.log('Parsed data:', {
      propertyId,
      personalInfo,
      address: address?.current,
      emergencyContact: emergencyContact?.name
    });

    // Validate required fields manually as backup
    if (!personalInfo?.firstName?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'personalInfo.firstName', message: 'First name is required', value: personalInfo?.firstName || '' }]
      });
    }

    if (!personalInfo?.lastName?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'personalInfo.lastName', message: 'Last name is required', value: personalInfo?.lastName || '' }]
      });
    }

    if (!personalInfo?.phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'personalInfo.phone', message: 'Phone number is required', value: personalInfo?.phone || '' }]
      });
    }

    // Fetch product
    const property = await Product.findById(propertyId).populate('seller');
    if (!property) {
      return res.status(404).json({ 
        success: false, 
        message: 'Property not found' 
      });
    }

    console.log('Property found:', {
      id: property._id,
      title: property.title,
      registrationFee: property.propertyDetails?.registrationFee
    });

    if (!property.propertyDetails?.registrationFee || property.propertyDetails.registrationFee <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Property does not require registration or registration fee not set' 
      });
    }

    // Check for existing pending registration
    const existingRegistration = await PropertyRegistration.findOne({
      property: propertyId,
      customer: req.user.id,
      'payment.paymentStatus': { $in: ['pending', 'processing'] }
    });

    if (existingRegistration) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a pending registration for this property' 
      });
    }

    // Handle document uploads
    const documents = [];
    if (req.files?.length > 0) {
      console.log('Processing', req.files.length, 'documents');
      for (const file of req.files) {
        try {
          const uploadResult = await uploadToCloudinary(file.path, 'registrations/documents');
          documents.push({
            type: file.fieldname,
            name: file.originalname,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
          });
          console.log('Document uploaded:', file.originalname);
        } catch (err) {
          console.error('Document upload error:', err);
          // Continue with other documents, don't fail the entire process
        }
      }
    }

    // Handle sameAsCurrent address
    const processedAddress = { ...address };
    if (address?.permanent?.sameAsCurrent) {
      processedAddress.permanent = { 
        ...address.current, 
        sameAsCurrent: true 
      };
    }

    // Create registration record
    const registrationNumber = await generateRegistrationNumber();
    console.log('Generated registration number:', registrationNumber);

    const registration = await PropertyRegistration.create({
      registrationNumber,
      property: propertyId,
      customer: req.user.id,
      personalInfo,
      address: processedAddress,
      emergencyContact,
      financialInfo,
      documents,
      status: 'pending',
      payment: {
        amount: property.propertyDetails.registrationFee,
        currency: property.pricing?.currency || 'ETB',
        provider: 'chapa',
        paymentStatus: 'pending'
      }
    });

    console.log('Registration created:', registration._id);

    // Create payment record
    const tx_ref = generateTxRef({ prefix: 'REG', size: 20 });
console.log('Generated tx_ref:', tx_ref);

    const payment = await Payment.create({
      paymentId: tx_ref,
      registration: registration._id,
      payer: req.user.id,
      amount: property.propertyDetails.registrationFee,
      currency: property.pricing?.currency || 'ETB',
      provider: 'chapa',
      status: 'pending'
    });

    console.log('Payment record created:', payment._id);

    // Prepare URLs
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    
    const callbackUrl = `${baseUrl}/api/payments/chapa/webhook`;
    const returnUrl = `${frontendUrl}/registration/${registration._id}/payment-success`;

    console.log('Payment URLs:', { callbackUrl, returnUrl });

    // Initiate Chapa payment
    console.log('Initiating Chapa payment...');
    // In your controller:
const chapaResp = await initiateChapa({
  tx_ref,
  amount: property.propertyDetails.registrationFee,
  currency: property.pricing?.currency || 'ETB',
  email: personalInfo.email,
  firstName: personalInfo.firstName,
  lastName: personalInfo.lastName,
  phone: personalInfo.phone,
  callbackUrl,
  returnUrl,
  customization: {
    title: 'TesGold Reg', // 11 characters - fits within 16
    description: `Property registration for ${property.title}` // Will be truncated to 50 chars automatically
  }
});

    console.log('Chapa response:', chapaResp);

    if (!chapaResp.success) {
      console.error('Chapa initiation failed:', chapaResp);
      
      // Update payment and registration status
      payment.status = 'failed';
      await payment.save();

      registration.payment.paymentStatus = 'failed';
      await registration.save();

      return res.status(500).json({ 
        success: false, 
        message: chapaResp.message || 'Failed to initiate payment',
        details: chapaResp.details
      });
    }

    // Update registration with payment info
    registration.payment.tx_ref = tx_ref;
    registration.payment.paymentRecord = payment._id;
    await registration.save();

    console.log('Registration updated with payment info');

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Registration created and payment initiated',
      data: {
        registration: {
          _id: registration._id,
          registrationNumber: registration.registrationNumber,
          status: registration.status,
          payment: registration.payment
        },
        paymentUrl: chapaResp.data.checkout_url,
        tx_ref
      }
    });

  } catch (err) {
    console.error('=== Registration Submission Error ===');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));

    return res.status(500).json({ 
      success: false, 
      message: 'Server error while submitting registration',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

/**
 * Verify registration payment from frontend return page (idempotent)
 * route: POST /api/property-registrations/:id/verify-payment
 */
export const verifyRegistrationPayment = async (req, res) => {
  try {
    console.log('=== Payment Verification Started ===');
    const { id } = req.params;
    const { tx_ref } = req.body;

    console.log('Verification request:', { registrationId: id, tx_ref });

    // Validate inputs
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Registration ID is required' 
      });
    }

    if (!tx_ref?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction reference is required' 
      });
    }

    // Find registration
    const registration = await PropertyRegistration.findById(id)
      .populate('property', 'title propertyDetails pricing')
      .populate('customer', 'customerProfile email');
      
    if (!registration) {
      console.log('Registration not found:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }

    console.log('Registration found:', {
      id: registration._id,
      registrationNumber: registration.registrationNumber,
      currentStatus: registration.status,
      paymentStatus: registration.payment.paymentStatus
    });

    // Verify user ownership (optional security check)
    if (req.user && registration.customer._id.toString() !== req.user.id && req.user.userType !== 'admin') {
      console.log('Unauthorized verification attempt:', {
        userId: req.user.id,
        registrationCustomer: registration.customer._id.toString()
      });
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to verify this payment' 
      });
    }

    // Find payment document
    const payment = await Payment.findOne({ paymentId: tx_ref.trim() });
    if (!payment) {
      console.log('Payment record not found for tx_ref:', tx_ref);
      return res.status(404).json({ 
        success: false, 
        message: 'Payment record not found' 
      });
    }

    console.log('Payment record found:', {
      id: payment._id,
      status: payment.status,
      amount: payment.amount,
      registration: payment.registration
    });

    // Verify payment belongs to this registration
    if (payment.registration.toString() !== registration._id.toString()) {
      console.log('Payment-Registration mismatch:', {
        paymentRegistration: payment.registration,
        requestRegistration: registration._id
      });
      return res.status(400).json({ 
        success: false, 
        message: 'Payment does not belong to this registration' 
      });
    }

    // If payment already completed, return success (idempotent)
    if (payment.status === 'completed') {
      console.log('Payment already completed');
      return res.status(200).json({ 
        success: true, 
        message: 'Payment already verified and completed', 
        data: { 
          registration: {
            _id: registration._id,
            registrationNumber: registration.registrationNumber,
            status: registration.status,
            payment: registration.payment
          }
        }
      });
    }

    // If payment failed before, check if we should retry verification
    if (payment.status === 'failed' && registration.payment.paymentStatus === 'failed') {
      console.log('Retrying verification for previously failed payment');
    }

    console.log('Starting Chapa verification for tx_ref:', tx_ref);

    // Verify using Chapa
    const verifyResp = await verifyChapa(tx_ref.trim());
    console.log('Chapa verification response:', {
      success: verifyResp.success,
      hasData: !!verifyResp.data,
      message: verifyResp.message
    });

    if (!verifyResp.success) {
      console.error('Chapa verification failed:', verifyResp.message);
      
      // Update payment to failed so frontend gets immediate feedback
      payment.status = 'failed';
      payment.gatewayResponse = {
        error: verifyResp.message,
        details: verifyResp.details,
        verifiedAt: new Date()
      };
      await payment.save();

      registration.payment.paymentStatus = 'failed';
      await registration.save();

      return res.status(400).json({ 
        success: false, 
        message: verifyResp.message || 'Payment verification failed. Please contact support if you believe this is an error.',
        data: { 
          registration: {
            _id: registration._id,
            registrationNumber: registration.registrationNumber,
            status: registration.status,
            payment: registration.payment
          }
        }
      });
    }

    const verifyData = verifyResp.data;
    console.log('Chapa verification data:', {
      status: verifyData.status,
      amount: verifyData.amount,
      reference: verifyData.reference,
      tx_ref: verifyData.tx_ref
    });

    // Validate amount matches (with some tolerance for floating point precision)
    const paidAmount = Number(verifyData.amount);
    const expectedAmount = Number(payment.amount);
    const amountTolerance = 0.01; // 1 cent tolerance

    if (paidAmount && Math.abs(paidAmount - expectedAmount) > amountTolerance) {
      console.error('Amount mismatch:', {
        expected: expectedAmount,
        received: paidAmount,
        difference: Math.abs(paidAmount - expectedAmount)
      });

      payment.status = 'failed';
      payment.gatewayResponse = {
        ...verifyData,
        error: 'Amount mismatch',
        expectedAmount,
        receivedAmount: paidAmount
      };
      await payment.save();

      registration.payment.paymentStatus = 'failed';
      await registration.save();

      return res.status(400).json({ 
        success: false, 
        message: `Payment amount mismatch. Expected ${expectedAmount} ${payment.currency}, but received ${paidAmount} ${payment.currency}.`
      });
    }

    // Check if payment is successful
    if (verifyData.status === 'success') {
      console.log('Payment verification successful, updating records');

      // Update payment record
      payment.status = 'completed';
      payment.externalPaymentId = verifyData.reference || verifyData.tx_ref || verifyData.transaction_id || '';
      payment.gatewayResponse = verifyData;
      payment.paidAt = new Date();
      await payment.save();

      // Update registration record
      registration.payment.paymentStatus = 'completed';
      registration.payment.paymentRecord = payment._id;
      registration.payment.tx_ref = tx_ref;
      registration.payment.paidAt = new Date();
      registration.status = 'under-review';
      await registration.save();

      console.log('Payment verification completed successfully');

      return res.status(200).json({ 
        success: true, 
        message: 'Payment verified successfully! Your registration is now under review and you will be contacted within 24-48 hours.',
        data: { 
          registration: {
            _id: registration._id,
            registrationNumber: registration.registrationNumber,
            status: registration.status,
            payment: registration.payment,
            property: {
              title: registration.property.title
            }
          }
        }
      });
    }

    // Payment verification returned but status is not success
    console.log('Payment verification returned non-success status:', verifyData.status);

    payment.status = 'failed';
    payment.gatewayResponse = verifyData;
    await payment.save();

    registration.payment.paymentStatus = 'failed';
    await registration.save();

    return res.status(400).json({ 
      success: false, 
      message: `Payment verification failed. Status: ${verifyData.status}. Please try again or contact support.`,
      data: { 
        registration: {
          _id: registration._id,
          registrationNumber: registration.registrationNumber,
          status: registration.status,
          payment: registration.payment
        }
      }
    });

  } catch (err) {
    console.error('=== Payment Verification Error ===');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Registration ID:', req.params.id);
    console.error('tx_ref:', req.body.tx_ref);

    return res.status(500).json({ 
      success: false, 
      message: 'Server error while verifying payment. Please try again or contact support.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


// @desc    Get customer registrations
// @route   GET /api/property-registrations/my-registrations
// @access  Private (Customer)
// @desc    Get customer registrations
// @route   GET /api/property-registrations/my-registrations
// @access  Private (Customer)
// controllers/property/propertyRegistrationController.js

// Update the getMyRegistrations function
export const getMyRegistrations = async (req, res) => {
  try {
    console.log('=== Get My Registrations ===');
    console.log('User ID:', req.user.id);
    console.log('Query params:', req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { customer: req.user.id };
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      query['payment.paymentStatus'] = req.query.paymentStatus;
    }

    console.log('Query filter:', query);

    // Fetch registrations with proper population
    const registrations = await PropertyRegistration.find(query)
      .populate({
        path: 'property',
        select: 'title media.images pricing propertyDetails.location propertyDetails.registrationFee seller', // Fixed field name
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile email'
        }
      })
      .populate('reviewedBy', 'companyProfile individualProfile email') // ✅ Now this field exists
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PropertyRegistration.countDocuments(query);

    console.log(`Found ${registrations.length} registrations out of ${total} total`);

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

    // Get payment stats for customer
    const paymentStats = await PropertyRegistration.aggregate([
      { $match: { customer: req.user._id } },
      {
        $group: {
          _id: '$payment.paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$payment.amount' }
        }
      }
    ]);

    console.log('Registration stats:', stats);
    console.log('Payment stats:', paymentStats);

    res.status(200).json({
      success: true,
      data: {
        registrations,
        stats: {
          byStatus: stats,
          byPaymentStatus: paymentStats
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('=== Get My Registrations Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('User ID:', req.user?.id);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching your registrations. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update the getAdminRegistrations function
export const getAdminRegistrations = async (req, res) => {
  try {
    console.log('=== Get Admin Registrations ===');
    console.log('Admin user:', req.user.id);
    console.log('Query params:', req.query);

    // Only admins can access this
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query with filters
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

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    console.log('Admin query filter:', query);

    const registrations = await PropertyRegistration.find(query)
      .populate({
        path: 'property',
        select: 'title media.images propertyDetails.registrationFee seller pricing', // Fixed field name
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile email'
        }
      })
      .populate('customer', 'customerProfile email')
      .populate('reviewedBy', 'companyProfile individualProfile email') // ✅ Now this field exists
      .populate({
        path: 'payment.paymentRecord',
        select: 'status paidAt externalPaymentId gatewayResponse'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PropertyRegistration.countDocuments(query);

    console.log(`Admin found ${registrations.length} registrations out of ${total} total`);

    // Get comprehensive statistics for admin
    const stats = await PropertyRegistration.aggregate([
      { $match: query.createdAt ? { createdAt: query.createdAt } : {} },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$payment.amount' }
        }
      }
    ]);

    // Get payment statistics
    const paymentStats = await PropertyRegistration.aggregate([
      { $match: query.createdAt ? { createdAt: query.createdAt } : {} },
      {
        $group: {
          _id: '$payment.paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$payment.amount' }
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
          totalRevenue: { $sum: '$payment.amount' },
          completedPayments: {
            $sum: { $cond: [{ $eq: ['$payment.paymentStatus', 'completed'] }, 1, 0] }
          }
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
      { $unwind: '$ownerDetails' },
      {
        $project: {
          _id: 1,
          registrationCount: 1,
          totalRevenue: 1,
          completedPayments: 1,
          ownerName: {
            $ifNull: [
              '$ownerDetails.companyProfile.companyName',
              { $concat: ['$ownerDetails.individualProfile.firstName', ' ', '$ownerDetails.individualProfile.lastName'] }
            ]
          },
          ownerEmail: '$ownerDetails.email'
        }
      }
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
          revenue: { $sum: '$payment.amount' },
          completedPayments: {
            $sum: { $cond: [{ $eq: ['$payment.paymentStatus', 'completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Calculate total revenue from completed payments only
    const totalRevenue = await PropertyRegistration.aggregate([
      { 
        $match: { 
          'payment.paymentStatus': 'completed',
          ...(query.createdAt && { createdAt: query.createdAt })
        } 
      },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ]);

    console.log('Admin stats computed:', {
      statusStats: stats.length,
      paymentStats: paymentStats.length,
      propertyOwners: propertyOwners.length,
      monthlyStats: monthlyStats.length,
      totalRevenue: totalRevenue[0]?.total || 0
    });

    res.status(200).json({
      success: true,
      data: {
        registrations,
        stats: {
          byStatus: stats,
          byPaymentStatus: paymentStats
        },
        propertyOwners,
        monthlyStats,
        totalRevenue: totalRevenue[0]?.total || 0,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('=== Get Admin Registrations Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Admin user:', req.user?.id);
    console.error('Query params:', req.query);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching registrations. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update the updateRegistrationStatus function
export const updateRegistrationStatus = async (req, res) => {
  try {
    console.log('=== Update Registration Status ===');
    console.log('Registration ID:', req.params.id);
    console.log('Admin user:', req.user.id);
    console.log('Update data:', req.body);

    const { status, adminNotes } = req.body; // ✅ Use adminNotes field
    
    // Only admins can update registration status
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'under-review', 'approved', 'rejected', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const registration = await PropertyRegistration.findById(req.params.id)
      .populate({
        path: 'property',
        select: 'title seller propertyDetails', // Fixed field name
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile email'
        }
      })
      .populate('customer', 'customerProfile email');

    if (!registration) {
      console.log('Registration not found for update:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    console.log('Registration found for update:', {
      id: registration._id,
      registrationNumber: registration.registrationNumber,
      currentStatus: registration.status,
      customerEmail: registration.customer.email
    });

    const oldStatus = registration.status;
    
    // Update registration
    if (status) {
      registration.status = status;
      
      // Set status-specific timestamps
      if (status === 'approved') {
        registration.approvedAt = new Date();
      } else if (status === 'rejected') {
        registration.rejectedAt = new Date();
      }
    }
    
    if (adminNotes) {
      registration.adminNotes = adminNotes; // ✅ Use adminNotes field
    }

    // Add reviewer information
    registration.reviewedBy = req.user.id; // ✅ Now this field exists
    registration.reviewedAt = new Date(); // ✅ Now this field exists

    await registration.save();

    console.log('Registration status updated:', {
      id: registration._id,
      from: oldStatus,
      to: registration.status,
      reviewedBy: req.user.id
    });

    res.status(200).json({
      success: true,
      message: `Registration status updated from "${oldStatus}" to "${registration.status}"`,
      data: { 
        registration: {
          _id: registration._id,
          registrationNumber: registration.registrationNumber,
          status: registration.status,
          adminNotes: registration.adminNotes,
          reviewedAt: registration.reviewedAt,
          reviewedBy: registration.reviewedBy
        }
      }
    });

  } catch (error) {
    console.error('=== Update Registration Status Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Registration ID:', req.params.id);
    console.error('Admin user:', req.user?.id);

    res.status(500).json({
      success: false,
      message: 'Server error while updating registration status. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get registration details
// @route   GET /api/property-registrations/:id
// @access  Private (Admin/Customer)
export const getRegistrationDetails = async (req, res) => {
  try {
    console.log('=== Get Registration Details ===');
    console.log('Registration ID:', req.params.id);
    console.log('Requesting user:', req.user.id, req.user.userType);

    const registration = await PropertyRegistration.findById(req.params.id)
      .populate({
        path: 'property',
        select: 'title media.images realEstateDetails seller pricing',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile email'
        }
      })
      .populate('customer', 'customerProfile email')
      .populate('reviewedBy', 'companyProfile individualProfile email')
      .populate({
        path: 'payment.paymentRecord',
        select: 'status externalPaymentId paidAt gatewayResponse'
      });

    if (!registration) {
      console.log('Registration not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check authorization - admin can see all, customer can see only their own
    const isAdmin = req.user.userType === 'admin';
    const isCustomer = registration.customer._id.toString() === req.user.id;

    console.log('Authorization check:', {
      isAdmin,
      isCustomer,
      registrationCustomer: registration.customer._id.toString(),
      requestingUser: req.user.id
    });

    if (!isAdmin && !isCustomer) {
      console.log('Unauthorized access attempt to registration:', req.params.id);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this registration'
      });
    }

    console.log('Registration details fetched successfully:', {
      id: registration._id,
      registrationNumber: registration.registrationNumber,
      status: registration.status,
      paymentStatus: registration.payment.paymentStatus
    });

    res.status(200).json({
      success: true,
      data: { registration }
    });

  } catch (error) {
    console.error('=== Get Registration Details Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Registration ID:', req.params.id);
    console.error('User:', req.user?.id);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching registration details. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Export registrations to CSV
// @route   GET /api/property-registrations/export-csv
// @access  Private (Admin)
export const exportRegistrationsCSV = async (req, res) => {
  try {
    console.log('=== Export Registrations CSV ===');
    console.log('Admin user:', req.user.id);
    console.log('Export filters:', req.query);

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
    
    if (req.query.paymentStatus) {
      query['payment.paymentStatus'] = req.query.paymentStatus;
    }
    
    if (req.query.propertyOwner) {
      const ownerProperties = await Product.find({ seller: req.query.propertyOwner }).select('_id');
      query.property = { $in: ownerProperties.map(p => p._id) };
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    const registrations = await PropertyRegistration.find(query)
      .populate({
        path: 'property',
        select: 'title seller realEstateDetails',
        populate: {
          path: 'seller',
          select: 'companyProfile individualProfile'
        }
      })
      .populate('customer', 'customerProfile')
      .sort({ createdAt: -1 });

    console.log(`Exporting ${registrations.length} registrations`);

    // Generate CSV content with correct field references
    const csvHeader = [
      'Registration Number',
      'Property Title',
      'Property Owner',
      'Customer Name',
      'Email',
      'Phone',
      'Registration Fee',
      'Payment Status',
      'Registration Status',
      'Registration Date',
      'Payment Date',
      'Reviewed Date',
      'Notes'
    ].join(',');

    const csvRows = registrations.map(reg => [
      reg.registrationNumber,
      `"${reg.property.title.replace(/"/g, '""')}"`, // Escape quotes in CSV
      `"${reg.property.seller.companyProfile?.companyName || 
          `${reg.property.seller.individualProfile?.firstName || ''} ${reg.property.seller.individualProfile?.lastName || ''}`.trim()}"`,
      `"${reg.personalInfo.firstName || ''} ${reg.personalInfo.lastName || ''}".trim()`,
      reg.personalInfo.email || '',
      reg.personalInfo.phone || '',
      reg.payment.amount || 0,
      reg.payment.paymentStatus,
      reg.status,
      reg.createdAt.toISOString().split('T')[0],
      reg.payment.paidAt ? reg.payment.paidAt.toISOString().split('T')[0] : '',
      reg.reviewedAt ? reg.reviewedAt.toISOString().split('T')[0] : '',
      `"${(reg.notes || '').replace(/"/g, '""')}"` // Escape quotes in notes
    ].join(','));

    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Set response headers for file download
    const filename = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(csvContent));
    
    console.log('CSV export completed:', { filename, rows: csvRows.length });
    
    res.status(200).send(csvContent);

  } catch (error) {
    console.error('=== Export CSV Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Admin user:', req.user?.id);

    res.status(500).json({
      success: false,
      message: 'Server error while exporting registrations. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate registration certificate
// @route   GET /api/property-registrations/:id/certificate
// @access  Private (Admin/Customer)
export const generateRegistrationCertificate = async (req, res) => {
  try {
    console.log('=== Generate Registration Certificate ===');
    console.log('Registration ID:', req.params.id);
    console.log('Requesting user:', req.user.id, req.user.userType);

    const registration = await PropertyRegistration.findById(req.params.id)
      .populate('property', 'title realEstateDetails')
      .populate('customer', 'customerProfile')
      .populate('reviewedBy', 'companyProfile individualProfile');

    if (!registration) {
      console.log('Registration not found for certificate:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Only generate certificate for approved registrations
    if (registration.status !== 'approved') {
      console.log('Certificate requested for non-approved registration:', {
        id: req.params.id,
        status: registration.status
      });
      return res.status(400).json({
        success: false,
        message: `Certificate can only be generated for approved registrations. Current status: ${registration.status}`
      });
    }

    // Check authorization
    const isAdmin = req.user.userType === 'admin';
    const isCustomer = registration.customer._id.toString() === req.user.id;

    if (!isAdmin && !isCustomer) {
      console.log('Unauthorized certificate generation attempt:', req.params.id);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to generate certificate for this registration'
      });
    }

    console.log('Generating certificate for approved registration:', {
      id: registration._id,
      registrationNumber: registration.registrationNumber,
      customer: registration.personalInfo.firstName + ' ' + registration.personalInfo.lastName
    });

    // Generate PDF certificate
    const certificateData = {
      registrationNumber: registration.registrationNumber,
      customerName: `${registration.personalInfo.firstName} ${registration.personalInfo.lastName}`,
      propertyTitle: registration.property.title,
      registrationDate: registration.createdAt,
      approvedDate: registration.reviewedAt, // Using reviewedAt since approvedAt doesn't exist in model
      reviewerName: registration.reviewedBy ? 
        (registration.reviewedBy.companyProfile?.companyName || 
         `${registration.reviewedBy.individualProfile?.firstName || ''} ${registration.reviewedBy.individualProfile?.lastName || ''}`.trim()) 
        : 'TesGold Admin',
      propertyLocation: registration.property.realEstateDetails?.location?.city || 'N/A'
    };

    const pdfBuffer = await generatePDF('registration-certificate', certificateData);

    const filename = `registration-certificate-${registration.registrationNumber}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    console.log('Certificate generated successfully:', filename);
    
    res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('=== Generate Certificate Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Registration ID:', req.params.id);
    console.error('User:', req.user?.id);

    res.status(500).json({
      success: false,
      message: 'Server error while generating certificate. Please try again or contact support.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get registration statistics
// @route   GET /api/property-registrations/stats
// @access  Private (Admin)
export const getRegistrationStats = async (req, res) => {
  try {
    console.log('=== Get Registration Stats ===');
    console.log('Admin user:', req.user.id);
    console.log('Period requested:', req.query.period);

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
      case 'all':
        dateFilter = {}; // No date filter
        break;
      default:
        dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    const baseMatch = dateFilter.createdAt ? { createdAt: dateFilter } : {};

    // Registration status statistics
    const statusStats = await PropertyRegistration.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Payment status statistics
    const paymentStats = await PropertyRegistration.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: '$payment.paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$payment.amount' }
        }
      }
    ]);

    // Total registrations in period
    const totalRegistrations = await PropertyRegistration.countDocuments(baseMatch);
    
    // Total completed payments and revenue
    const completedPayments = await PropertyRegistration.aggregate([
      { 
        $match: { 
          ...baseMatch,
          'payment.paymentStatus': 'completed' 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$payment.amount' },
          count: { $sum: 1 }
        } 
      }
    ]);

    // Daily stats for the period (for charts)
    const dailyStats = await PropertyRegistration.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          registrations: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$payment.paymentStatus', 'completed'] }, '$payment.amount', 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const statsData = {
      period,
      totalRegistrations,
      statusBreakdown: statusStats,
      paymentBreakdown: paymentStats,
      totalRevenue: completedPayments[0]?.total || 0,
      completedPaymentsCount: completedPayments[0]?.count || 0,
      dailyStats,
      averageRegistrationFee: totalRegistrations > 0 ? 
        (completedPayments[0]?.total || 0) / (completedPayments[0]?.count || 1) : 0
    };

    console.log('Stats computed:', {
      period,
      totalRegistrations,
      totalRevenue: statsData.totalRevenue,
      statusBreakdown: statusStats.length,
      paymentBreakdown: paymentStats.length
    });

    res.status(200).json({
      success: true,
      data: statsData
    });

  } catch (error) {
    console.error('=== Get Registration Stats Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Admin user:', req.user?.id);
    console.error('Period:', req.query.period);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching registration statistics. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Cancel registration (before payment or if payment failed)
// @route   DELETE /api/property-registrations/:id
// @access  Private (Customer/Admin)
export const cancelRegistration = async (req, res) => {
  try {
    console.log('=== Cancel Registration ===');
    console.log('Registration ID:', req.params.id);
    console.log('User:', req.user.id, req.user.userType);

    const registration = await PropertyRegistration.findById(req.params.id)
      .populate('customer', 'customerProfile email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check authorization
    const isAdmin = req.user.userType === 'admin';
    const isCustomer = registration.customer._id.toString() === req.user.id;

    if (!isAdmin && !isCustomer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration'
      });
    }

    // Only allow cancellation for certain statuses
    const cancellableStatuses = ['pending', 'under-review'];
    if (!cancellableStatuses.includes(registration.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel registration with status: ${registration.status}`
      });
    }

    // If payment was completed, don't allow cancellation by customer
    if (registration.payment.paymentStatus === 'completed' && !isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration after payment is completed. Please contact support.'
      });
    }

    // Update status to rejected/cancelled
    registration.status = 'rejected';
    registration.notes = registration.notes ? 
      `${registration.notes}\n\nCancelled by ${isAdmin ? 'admin' : 'customer'} on ${new Date().toISOString()}` :
      `Cancelled by ${isAdmin ? 'admin' : 'customer'} on ${new Date().toISOString()}`;
    
    if (isAdmin) {
      registration.reviewedBy = req.user.id;
      registration.reviewedAt = new Date();
    }

    await registration.save();

    console.log('Registration cancelled:', {
      id: registration._id,
      registrationNumber: registration.registrationNumber,
      cancelledBy: isAdmin ? 'admin' : 'customer'
    });

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
      data: { registration }
    });

  } catch (error) {
    console.error('=== Cancel Registration Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    res.status(500).json({
      success: false,
      message: 'Server error while cancelling registration. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};