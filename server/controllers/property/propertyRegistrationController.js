// controllers/property/propertyRegistrationController.js
import PropertyRegistration from '../../models/PropertyRegistration.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import { validationResult } from 'express-validator';
import { uploadToCloudinary } from '../../utils/upload/cloudinaryService.js';
import { sendNotification } from '../../services/notificationService.js';
import { initiatePayment, verifyPayment } from '../../services/paymentService.js';

import { generatePDF } from '../../utils/pdfGenerator.js';
import { sendEmail } from '../../utils/email/emailService.js';

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
        errors: errors.array()
      });
    }

    const { propertyId, personalInfo, address, emergencyContact, financialInfo } = req.body;

    // Verify property exists and has registration fee
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
        message: 'This property does not require registration'
      });
    }

    // Check if user already registered for this property
    const existingRegistration = await PropertyRegistration.findOne({
      property: propertyId,
      customer: req.user.id,
      status: { $in: ['pending', 'approved', 'under-review'] }
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this property'
      });
    }

    // Handle document uploads
    let documents = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResult = await uploadToCloudinary(file.path, 'registrations/documents');
          documents.push({
            type: file.fieldname,
            name: file.originalname,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
          });
        } catch (uploadError) {
          console.error('Document upload error:', uploadError);
        }
      }
    }

    // Create registration
    const registration = await PropertyRegistration.create({
      property: propertyId,
      customer: req.user.id,
      personalInfo,
      address,
      emergencyContact,
      financialInfo,
      documents,
      payment: {
        registrationFee: property.propertyDetails.registrationFee,
        currency: property.pricing.currency,
        paymentMethod: 'chapa',
        paymentStatus: 'pending'
      }
    });

    await registration.populate([
      { path: 'property', select: 'title propertyDetails.registrationFee pricing.currency' },
      { path: 'customer', select: 'firstName lastName email' }
    ]);

    // Initiate payment
    const paymentData = {
      amount: property.propertyDetails.registrationFee,
      currency: property.pricing.currency,
      email: personalInfo.email,
      phone: personalInfo.phone,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      description: `Property registration for ${property.title}`,
      callbackUrl: `${process.env.FRONTEND_URL}/registration/${registration._id}/payment-callback`,
      returnUrl: `${process.env.FRONTEND_URL}/registration/${registration._id}/payment-success`,
      customization: {
        title: 'Property Registration Fee',
        description: `Registration fee for ${property.title}`
      }
    };

    const paymentResponse = await initiatePayment(paymentData);
    
    if (paymentResponse.success) {
      registration.payment.transactionId = paymentResponse.data.tx_ref;
      await registration.save();
    }

    // Notify property seller/company
    await sendNotification(property.seller, {
      type: 'new_registration',
      title: 'New Property Registration',
      message: `${personalInfo.firstName} ${personalInfo.lastName} registered for ${property.title}`,
      data: { registrationId: registration._id, propertyId }
    });

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: {
        registration,
        paymentUrl: paymentResponse.data?.checkout_url
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

// @desc    Verify payment callback
// @route   POST /api/property-registrations/:id/verify-payment
// @access  Public (webhook)
export const verifyRegistrationPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { tx_ref, status } = req.body;

    const registration = await PropertyRegistration.findById(id)
      .populate('property', 'title seller')
      .populate('customer', 'firstName lastName email');

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

      // Generate receipt
      const receiptData = {
        registrationNumber: registration.registrationNumber,
        customerName: `${registration.personalInfo.firstName} ${registration.personalInfo.lastName}`,
        propertyTitle: registration.property.title,
        amount: registration.payment.registrationFee,
        currency: registration.payment.currency,
        paymentDate: registration.payment.paymentDate,
        transactionId: tx_ref
      };

      const receiptPDF = await generatePDF('registration-receipt', receiptData);
      const receiptUpload = await uploadToCloudinary(receiptPDF, 'receipts');
      registration.payment.receiptUrl = receiptUpload.secure_url;
      await registration.save();

      // Send confirmation emails
      await sendEmail({
        to: registration.customer.email,
        subject: 'Property Registration Confirmed',
        template: 'registration-confirmation',
        data: {
          customerName: `${registration.personalInfo.firstName} ${registration.personalInfo.lastName}`,
          propertyTitle: registration.property.title,
          registrationNumber: registration.registrationNumber,
          receiptUrl: registration.payment.receiptUrl
        }
      });

      // Notify seller
      await sendNotification(registration.property.seller, {
        type: 'registration_payment_completed',
        title: 'Registration Payment Completed',
        message: `Payment completed for ${registration.property.title} registration`,
        data: { registrationId: registration._id }
      });

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
      .populate('property', 'title media.images pricing propertyDetails.location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PropertyRegistration.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        registrations,
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

// @desc    Get company registrations
// @route   GET /api/property-registrations/company-registrations
// @access  Private (Company/Individual sellers)
export const getCompanyRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get properties owned by this seller
    const sellerProperties = await Product.find({ seller: req.user.id }).select('_id');
    const propertyIds = sellerProperties.map(p => p._id);

    const query = { property: { $in: propertyIds } };
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.property) {
      query.property = req.query.property;
    }

    const registrations = await PropertyRegistration.find(query)
      .populate('property', 'title media.images')
      .populate('customer', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PropertyRegistration.countDocuments(query);

    // Get statistics
    const stats = await PropertyRegistration.aggregate([
      { $match: { property: { $in: propertyIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$payment.registrationFee' }
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
    console.error('Get company registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching company registrations'
    });
  }
};

// @desc    Update registration status
// @route   PUT /api/property-registrations/:id/status
// @access  Private (Seller/Admin)
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const registration = await PropertyRegistration.findById(req.params.id)
      .populate('property', 'seller title')
      .populate('customer', 'firstName lastName email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check authorization
    const isOwner = registration.property.seller.toString() === req.user.id;
    const isAdmin = req.user.userType === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this registration'
      });
    }

    const oldStatus = registration.status;
    registration.status = status;
    registration.adminNotes = adminNotes || registration.adminNotes;
    registration.reviewedBy = req.user.id;
    registration.reviewedAt = new Date();

    if (status === 'approved') {
      registration.approvedAt = new Date();
    }

    await registration.save();

    // Send notification to customer
    const statusMessages = {
      'approved': 'Your property registration has been approved!',
      'rejected': 'Your property registration has been rejected.',
      'under-review': 'Your property registration is under review.'
    };

    await sendNotification(registration.customer._id, {
      type: 'registration_status_update',
      title: 'Registration Status Updated',
      message: statusMessages[status] || `Registration status updated to ${status}`,
      data: { registrationId: registration._id, status }
    });

    // Send email notification
    await sendEmail({
      to: registration.customer.email,
      subject: `Registration Status Update - ${registration.property.title}`,
      template: 'registration-status-update',
      data: {
        customerName: `${registration.customer.firstName} ${registration.customer.lastName}`,
        propertyTitle: registration.property.title,
        status,
        adminNotes,
        registrationNumber: registration.registrationNumber
      }
    });

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

// @desc    Download customer information as CSV
// @route   GET /api/property-registrations/export-csv
// @access  Private (Seller)
export const exportRegistrationsCSV = async (req, res) => {
  try {
    // Get properties owned by this seller
    const sellerProperties = await Product.find({ seller: req.user.id }).select('_id title');
    const propertyIds = sellerProperties.map(p => p._id);

    const registrations = await PropertyRegistration.find({ 
      property: { $in: propertyIds },
      status: { $in: ['approved', 'completed'] }
    })
    .populate('property', 'title')
    .sort({ createdAt: -1 });

    // Generate CSV content
    const csvHeader = [
      'Registration Number',
      'Property Title',
      'Customer Name',
      'Email',
      'Phone',
      'Registration Fee',
      'Status',
      'Registration Date',
      'Payment Date'
    ].join(',');

    const csvRows = registrations.map(reg => [
      reg.registrationNumber,
      reg.property.title,
      `${reg.personalInfo.firstName} ${reg.personalInfo.lastName}`,
      reg.personalInfo.email,
      reg.personalInfo.phone,
      reg.payment.registrationFee,
      reg.status,
      reg.createdAt.toISOString().split('T')[0],
      reg.payment.paymentDate ? reg.payment.paymentDate.toISOString().split('T')[0] : ''
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

