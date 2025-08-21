import ServiceInquiry from '../../models/ServiceInquiry.js';
import User from '../../models/User.js';
import { sendEmail } from '../../utils/email/emailService.js';
import { uploadToCloudinary } from '../../utils/upload/cloudinaryService.js';

// @desc    Create service inquiry
// @route   POST /api/service-inquiries
// @access  Private
export const createServiceInquiry = async (req, res) => {
  try {
    const {
      serviceProvider,
      serviceType,
      customerInfo,
      projectDetails,
      priority = 'medium'
    } = req.body;

    // Validate service provider
    const provider = await User.findById(serviceProvider);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    // Check if provider offers the requested service
    const providerCategories = provider.companyProfile?.businessCategories || [];
    const serviceMapping = {
      'project-management': 'construction',
      'engineering-design': 'engineering',
      'interior-design': 'interior-design',
      'consultancy': 'services'
    };

    if (!providerCategories.includes(serviceMapping[serviceType]) && !providerCategories.includes('services')) {
      return res.status(400).json({
        success: false,
        message: 'Service provider does not offer this service type'
      });
    }

    // Handle file attachments
    let attachments = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.path, 'service-inquiries'));
      const uploadedFiles = await Promise.all(uploadPromises);
      
      attachments = uploadedFiles.map(file => ({
        name: file.original_filename,
        url: file.secure_url,
        type: file.resource_type
      }));
    }

    const inquiryData = {
      customer: req.user.id,
      serviceProvider,
      serviceType,
      customerInfo: customerInfo || {
        firstName: req.user.customerProfile?.firstName || req.user.individualProfile?.firstName,
        lastName: req.user.customerProfile?.lastName || req.user.individualProfile?.lastName,
        email: req.user.email,
        phone: req.user.customerProfile?.phone || req.user.individualProfile?.phone
      },
      projectDetails,
      attachments,
      priority
    };

    const inquiry = await ServiceInquiry.create(inquiryData);

    // Send notification email to service provider
    await sendEmail({
      to: provider.email,
      subject: 'New Service Inquiry - CitiLights',
      template: 'serviceInquiryNotification',
      data: {
        providerName: provider.fullName,
        customerName: `${inquiryData.customerInfo.firstName} ${inquiryData.customerInfo.lastName}`,
        serviceType: serviceType.replace('-', ' ').toUpperCase(),
        projectTitle: projectDetails.title,
        projectDescription: projectDetails.description,
        inquiryUrl: `${process.env.CLIENT_URL}/dashboard/service-inquiries/${inquiry._id}`
      }
    });

    // Send confirmation email to customer
    await sendEmail({
      to: inquiryData.customerInfo.email,
      subject: 'Service Inquiry Submitted - CitiLights',
      template: 'serviceInquiryConfirmation',
      data: {
        customerName: `${inquiryData.customerInfo.firstName} ${inquiryData.customerInfo.lastName}`,
        providerName: provider.fullName,
        serviceType: serviceType.replace('-', ' ').toUpperCase(),
        projectTitle: projectDetails.title
      }
    });

    const populatedInquiry = await ServiceInquiry.findById(inquiry._id)
      .populate('customer', 'customerProfile individualProfile email')
      .populate('serviceProvider', 'companyProfile individualProfile email');

    res.status(201).json({
      success: true,
      message: 'Service inquiry submitted successfully',
      data: { inquiry: populatedInquiry }
    });
  } catch (error) {
    console.error('Create service inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating service inquiry'
    });
  }
};

// @desc    Get customer's service inquiries
// @route   GET /api/service-inquiries/my-inquiries
// @access  Private
export const getMyInquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { customer: req.user.id };

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Service type filter
    if (req.query.serviceType) {
      query.serviceType = req.query.serviceType;
    }

    const inquiries = await ServiceInquiry.find(query)
      .populate('serviceProvider', 'companyProfile individualProfile email sellerRating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ServiceInquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        inquiries,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalInquiries: total
        }
      }
    });
  } catch (error) {
    console.error('Get my inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inquiries'
    });
  }
};

// @desc    Get service provider's inquiries
// @route   GET /api/service-inquiries/provider/inquiries
// @access  Private (Service providers only)
export const getProviderInquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { serviceProvider: req.user.id };

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Priority filter
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Service type filter
    if (req.query.serviceType) {
      query.serviceType = req.query.serviceType;
    }

    const inquiries = await ServiceInquiry.find(query)
      .populate('customer', 'customerProfile individualProfile email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ServiceInquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        inquiries,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalInquiries: total
        }
      }
    });
  } catch (error) {
    console.error('Get provider inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching provider inquiries'
    });
  }
};

// @desc    Get single service inquiry
// @route   GET /api/service-inquiries/:id
// @access  Private
export const getServiceInquiry = async (req, res) => {
  try {
    const inquiry = await ServiceInquiry.findById(req.params.id)
      .populate('customer', 'customerProfile individualProfile email')
      .populate('serviceProvider', 'companyProfile individualProfile email sellerRating')
      .populate('messages.sender', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName customerProfile.firstName customerProfile.lastName');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Service inquiry not found'
      });
    }

    // Check authorization
    const isCustomer = inquiry.customer._id.toString() === req.user.id;
    const isProvider = inquiry.serviceProvider._id.toString() === req.user.id;
    const isAdmin = req.user.userType === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this inquiry'
      });
    }

    res.status(200).json({
      success: true,
      data: { inquiry }
    });
  } catch (error) {
    console.error('Get service inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching service inquiry'
    });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/service-inquiries/:id/status
// @access  Private
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const inquiry = await ServiceInquiry.findById(req.params.id)
      .populate('customer', 'customerProfile individualProfile email')
      .populate('serviceProvider', 'companyProfile individualProfile email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Service inquiry not found'
      });
    }

    // Check authorization
    const isProvider = inquiry.serviceProvider._id.toString() === req.user.id;
    const isCustomer = inquiry.customer._id.toString() === req.user.id;
    const isAdmin = req.user.userType === 'admin';

    if (!isProvider && !isCustomer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry'
      });
    }

    // Validate status transitions
    const validTransitions = {
      pending: ['reviewing', 'rejected'],
      reviewing: ['quoted', 'rejected'],
      quoted: ['accepted', 'rejected'],
      accepted: ['completed'],
      rejected: [],
      completed: []
    };

    if (!validTransitions[inquiry.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${inquiry.status} to ${status}`
      });
    }

    inquiry.status = status;
    
    // Add message to inquiry timeline
    if (note) {
      inquiry.messages.push({
        sender: req.user.id,
        content: note,
        timestamp: new Date()
      });
    }

    await inquiry.save();

    // Send status update email
    const recipientEmail = isProvider ? inquiry.customerInfo.email : inquiry.serviceProvider.email;
    const recipientName = isProvider ? 
      `${inquiry.customerInfo.firstName} ${inquiry.customerInfo.lastName}` : 
      inquiry.serviceProvider.fullName;

    await sendEmail({
      to: recipientEmail,
      subject: `Service Inquiry Update - ${inquiry._id}`,
      template: 'serviceInquiryStatusUpdate',
      data: {
        recipientName,
        status,
        projectTitle: inquiry.projectDetails.title,
        note,
        inquiryUrl: `${process.env.CLIENT_URL}/dashboard/service-inquiries/${inquiry._id}`
      }
    });

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: { inquiry }
    });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating inquiry status'
    });
  }
};

// @desc    Submit quote
// @route   POST /api/service-inquiries/:id/quote
// @access  Private (Service providers only)
export const submitQuote = async (req, res) => {
  try {
    const {
      amount,
      currency = 'ETB',
      breakdown,
      validUntil,
      terms
    } = req.body;

    const inquiry = await ServiceInquiry.findById(req.params.id)
      .populate('customer', 'customerProfile individualProfile email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Service inquiry not found'
      });
    }

    // Check authorization
    if (inquiry.serviceProvider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to quote for this inquiry'
      });
    }

    // Check if inquiry is in reviewable state
    if (!['pending', 'reviewing'].includes(inquiry.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot submit quote for this inquiry status'
      });
    }

    inquiry.quote = {
      amount,
      currency,
      breakdown: breakdown || [],
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      terms,
      quotedAt: new Date()
    };

    inquiry.status = 'quoted';
    await inquiry.save();

    // Send quote notification email
    await sendEmail({
      to: inquiry.customerInfo.email,
      subject: 'Quote Received - CitiLights',
      template: 'serviceQuoteReceived',
      data: {
        customerName: `${inquiry.customerInfo.firstName} ${inquiry.customerInfo.lastName}`,
        providerName: req.user.fullName,
        projectTitle: inquiry.projectDetails.title,
        quoteAmount: amount,
        currency,
        validUntil: inquiry.quote.validUntil.toLocaleDateString(),
        inquiryUrl: `${process.env.CLIENT_URL}/dashboard/service-inquiries/${inquiry._id}`
      }
    });

    res.status(200).json({
      success: true,
      message: 'Quote submitted successfully',
      data: { inquiry }
    });
  } catch (error) {
    console.error('Submit quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting quote'
    });
  }
};

// @desc    Add message to inquiry
// @route   POST /api/service-inquiries/:id/message
// @access  Private
export const addMessage = async (req, res) => {
  try {
    const { content, attachments } = req.body;
    
    const inquiry = await ServiceInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Service inquiry not found'
      });
    }

    // Check authorization
    const isCustomer = inquiry.customer.toString() === req.user.id;
    const isProvider = inquiry.serviceProvider.toString() === req.user.id;

    if (!isCustomer && !isProvider) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to message in this inquiry'
      });
    }

    const message = {
      sender: req.user.id,
      content,
      attachments: attachments || [],
      timestamp: new Date()
    };

    inquiry.messages.push(message);
    await inquiry.save();

    await inquiry.populate('messages.sender', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName customerProfile.firstName customerProfile.lastName');

    // Get the newly added message
    const newMessage = inquiry.messages[inquiry.messages.length - 1];

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      data: { message: newMessage }
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding message'
    });
  }
};

// @desc    Get service inquiry statistics
// @route   GET /api/service-inquiries/stats
// @access  Private (Service providers only)
export const getInquiryStats = async (req, res) => {
  try {
    const stats = await ServiceInquiry.aggregate([
      { $match: { serviceProvider: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          reviewing: {
            $sum: { $cond: [{ $eq: ['$status', 'reviewing'] }, 1, 0] }
          },
          quoted: {
            $sum: { $cond: [{ $eq: ['$status', 'quoted'] }, 1, 0] }
          },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          totalQuoteValue: {
            $sum: { $cond: [{ $ne: ['$quote.amount', null] }, '$quote.amount', 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      pending: 0,
      reviewing: 0,
      quoted: 0,
      accepted: 0,
      completed: 0,
      rejected: 0,
      totalQuoteValue: 0
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get inquiry stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inquiry statistics'
    });
  }
};