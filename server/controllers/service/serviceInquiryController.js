import ServiceInquiry from '../../models/ServiceInquiry.js';
import User from '../../models/User.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AppError } from '../../utils/appError.js';
import { sendNotification } from '../../Services/NotificationService.js';
import { uploadToCloudinary } from '../../utils/upload/cloudinaryService.js';
import { v4 as uuidv4 } from "uuid";
// @desc    Create new service inquiry
// @route   POST /api/service-inquiries
// @access  Private (Any authenticated user)




export const createServiceInquiry = asyncHandler(async (req, res) => {
  let { serviceType, projectDetails, serviceSpecifics } = req.body;

  // ✅ Parse JSON if frontend sends strings
  if (typeof projectDetails === "string") {
    try {
      projectDetails = JSON.parse(projectDetails);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid projectDetails JSON" });
    }
  }
  if (typeof serviceSpecifics === "string") {
    try {
      serviceSpecifics = JSON.parse(serviceSpecifics);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid serviceSpecifics JSON" });
    }
  }

  // ✅ Handle file uploads
  let attachments = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadResult = await uploadToCloudinary(file.buffer, file.originalname);
      attachments.push({
        name: file.originalname,
        url: uploadResult.secure_url,
        type: file.mimetype,
        size: file.size,
      });
    }
  }

  // ✅ Fallback customer if not authenticated
  const customerId = req.user?._id || "000000000000000000000000";

  // ✅ Auto-generate inquiry number
  const inquiryNumber = `INQ-${Date.now()}-${uuidv4().slice(0, 6)}`;

  // ✅ Create service inquiry
  const inquiry = await ServiceInquiry.create({
    inquiryNumber,
    customer: customerId,
    serviceType,
    projectDetails,
    serviceSpecifics: serviceSpecifics || {},
    attachments,
    source: "website",
  });

  // ✅ Populate customer if real user exists
  if (req.user?._id) {
    await inquiry.populate("customer", "firstName lastName email phone customerProfile");

    // 🔔 Notify admins
    const adminUsers = await User.find({ userType: "admin" });
    for (const admin of adminUsers) {
      await sendNotification(admin._id, {
        type: "new_service_inquiry",
        title: "New Service Inquiry",
        message: `New ${serviceType.replace("-", " ")} inquiry from ${inquiry.customer.firstName} ${inquiry.customer.lastName}`,
        data: { inquiryId: inquiry._id },
      });
    }
  }

  res.status(201).json({
    success: true,
    message: "✅ Service inquiry created successfully",
    data: inquiry,
  });
});


// @desc    Get customer's own inquiries
// @route   GET /api/service-inquiries/my-inquiries
// @access  Private (Customer)
export const getMyInquiries = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    serviceType,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = { customer: req.user.id };
  
  if (status) query.status = status;
  if (serviceType) query.serviceType = serviceType;

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const inquiries = await ServiceInquiry.find(query)
    .populate('assignedAdmin', 'firstName lastName email')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const total = await ServiceInquiry.countDocuments(query);

  res.json({
    success: true,
    data: {
      inquiries,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: inquiries.length,
        totalRecords: total
      }
    }
  });
});

// @desc    Get all inquiries for admin team
// @route   GET /api/service-inquiries/provider/inquiries
// @access  Private (Admin only)
export const getProviderInquiries = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    serviceType,
    assignedAdmin,
    priority,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let query = {};
  
  if (status) query.status = status;
  if (serviceType) query.serviceType = serviceType;
  if (assignedAdmin) query.assignedAdmin = assignedAdmin;
  if (priority) query.priority = priority;
  
  if (search) {
    query.$or = [
      { 'projectDetails.title': { $regex: search, $options: 'i' } },
      { 'projectDetails.description': { $regex: search, $options: 'i' } },
      { inquiryNumber: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const inquiries = await ServiceInquiry.find(query)
    .populate('customer', 'firstName lastName email phone customerProfile')
    .populate('assignedAdmin', 'firstName lastName email')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const total = await ServiceInquiry.countDocuments(query);

  // Get status counts for dashboard
  const statusCounts = await ServiceInquiry.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      inquiries,
      statusCounts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: inquiries.length,
        totalRecords: total
      }
    }
  });
});

// @desc    Get single service inquiry
// @route   GET /api/service-inquiries/:id
// @access  Private (Customer - own inquiries, Admin - all inquiries)
export const getServiceInquiry = asyncHandler(async (req, res) => {
  const inquiry = await ServiceInquiry.findById(req.params.id)
    .populate('customer', 'firstName lastName email phone customerProfile')
    .populate('assignedAdmin', 'firstName lastName email')
    .populate('messages.sender', 'firstName lastName email userType customerProfile')
    .populate('quotes.submittedBy', 'firstName lastName email')
    .populate('consultation.scheduledBy', 'firstName lastName email')
    .populate('statusHistory.changedBy', 'firstName lastName email')
    .populate('internalNotes.addedBy', 'firstName lastName email');

  if (!inquiry) {
    throw new AppError('Service inquiry not found', 404);
  }

  // Check permissions
  const isCustomer = req.user.id.toString() === inquiry.customer._id.toString();
  const isAdmin = req.user.userType === 'admin';

  if (!isCustomer && !isAdmin) {
    throw new AppError('Not authorized to access this inquiry', 403);
  }

  // Hide internal notes from customers
  if (isCustomer) {
    inquiry.internalNotes = undefined;
  }

  res.json({
    success: true,
    data: {
      inquiry
    }
  });
});

// @desc    Update inquiry status
// @route   PUT /api/service-inquiries/:id/status
// @access  Private (Admin only)
export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status, note, assignToMe } = req.body;

  const inquiry = await ServiceInquiry.findById(req.params.id);

  if (!inquiry) {
    throw new AppError('Service inquiry not found', 404);
  }

  const oldStatus = inquiry.status;
  inquiry.status = status;

  // Assign to current admin if requested
  if (assignToMe && !inquiry.assignedAdmin) {
    inquiry.assignedAdmin = req.user.id;
  }

  // Add to status history
  inquiry.statusHistory.push({
    status,
    changedBy: req.user.id,
    note: note || `Status changed from ${oldStatus} to ${status}`
  });

  await inquiry.save();
  await inquiry.populate('customer', 'firstName lastName email');
  await inquiry.populate('assignedAdmin', 'firstName lastName email');

  // Notify customer about status change
  await sendNotification(inquiry.customer._id, {
    type: 'inquiry_status_update',
    title: 'Inquiry Status Updated',
    message: `Your ${inquiry.serviceType.replace('-', ' ')} inquiry status has been updated to ${status}`,
    data: { inquiryId: inquiry._id, status }
  });

  res.json({
    success: true,
    data: {
      inquiry
    }
  });
});

// @desc    Submit quote for inquiry
// @route   POST /api/service-inquiries/:id/quote
// @access  Private (Admin only)
export const submitQuote = asyncHandler(async (req, res) => {
  const {
    amount,
    currency = 'ETB',
    breakdown,
    timeline,
    terms,
    validUntil
  } = req.body;

  const inquiry = await ServiceInquiry.findById(req.params.id);

  if (!inquiry) {
    throw new AppError('Service inquiry not found', 404);
  }

  if (inquiry.status === 'completed' || inquiry.status === 'cancelled') {
    throw new AppError('Cannot submit quote for completed or cancelled inquiry', 400);
  }

  // Create new quote
  const newQuote = {
    submittedBy: req.user.id,
    amount,
    currency,
    breakdown: breakdown || [],
    timeline: timeline || {},
    terms: terms || '',
    validUntil: new Date(validUntil)
  };

  inquiry.quotes.push(newQuote);
  inquiry.status = 'quoted';

  // Assign inquiry to current admin if not assigned
  if (!inquiry.assignedAdmin) {
    inquiry.assignedAdmin = req.user.id;
  }

  // Add to status history
  inquiry.statusHistory.push({
    status: 'quoted',
    changedBy: req.user.id,
    note: `Quote submitted for ${amount.toLocaleString()} ${currency}`
  });

  await inquiry.save();
  await inquiry.populate('customer', 'firstName lastName email');

  // Notify customer about new quote
  await sendNotification(inquiry.customer._id, {
    type: 'new_quote',
    title: 'New Quote Available',
    message: `A new quote has been submitted for your ${inquiry.serviceType.replace('-', ' ')} inquiry`,
    data: { inquiryId: inquiry._id, amount, currency }
  });

  res.json({
    success: true,
    data: {
      inquiry
    }
  });
});

// @desc    Respond to quote (accept/reject)
// @route   PUT /api/service-inquiries/:id/quotes/:quoteId/respond
// @access  Private (Customer - own inquiries)
export const respondToQuote = asyncHandler(async (req, res) => {
  const { action, message } = req.body; // action: 'accept' or 'reject'
  
  const inquiry = await ServiceInquiry.findById(req.params.id);

  if (!inquiry) {
    throw new AppError('Service inquiry not found', 404);
  }

  // Check if user is the customer
  if (req.user.id.toString() !== inquiry.customer.toString()) {
    throw new AppError('Not authorized to respond to this quote', 403);
  }

  const quote = inquiry.quotes.id(req.params.quoteId);
  if (!quote) {
    throw new AppError('Quote not found', 404);
  }

  if (quote.status !== 'pending') {
    throw new AppError('Quote has already been responded to', 400);
  }

  // Check if quote is expired
  if (new Date() > new Date(quote.validUntil)) {
    throw new AppError('Quote has expired', 400);
  }

  // Update quote status
  quote.status = action === 'accept' ? 'accepted' : 'rejected';
  quote.customerResponse = {
    action,
    message: message || '',
    respondedAt: new Date()
  };

  // Update inquiry status
  if (action === 'accept') {
    inquiry.status = 'accepted';
    // Reject all other pending quotes
    inquiry.quotes.forEach(q => {
      if (q._id.toString() !== quote._id.toString() && q.status === 'pending') {
        q.status = 'rejected';
      }
    });
  }

  // Add to status history
  inquiry.statusHistory.push({
    status: inquiry.status,
    changedBy: req.user.id,
    note: `Quote ${action}ed by customer${message ? ': ' + message : ''}`
  });

  await inquiry.save();

  // Notify admin team
  const adminUsers = await User.find({ userType: 'admin' });
  for (const admin of adminUsers) {
    await sendNotification(admin._id, {
      type: 'quote_response',
      title: `Quote ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
      message: `Customer ${action}ed quote for ${inquiry.projectDetails.title}`,
      data: { inquiryId: inquiry._id, action }
    });
  }

  res.json({
    success: true,
    data: {
      inquiry
    }
  });
});

// @desc    Add message to inquiry
// @route   POST /api/service-inquiries/:id/message
// @access  Private (Customer - own inquiries, Admin - all inquiries)
export const addMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const inquiry = await ServiceInquiry.findById(req.params.id);

  if (!inquiry) {
    throw new AppError('Service inquiry not found', 404);
  }

  // Check permissions
  const isCustomer = req.user.id.toString() === inquiry.customer.toString();
  const isAdmin = req.user.userType === 'admin';

  if (!isCustomer && !isAdmin) {
    throw new AppError('Not authorized to message on this inquiry', 403);
  }

  const newMessage = {
    sender: req.user.id,
    message,
    timestamp: new Date()
  };

  inquiry.messages.push(newMessage);
  await inquiry.save();

  await inquiry.populate('messages.sender', 'firstName lastName email userType customerProfile');

  // Notify the other party
  if (isCustomer && inquiry.assignedAdmin) {
    await sendNotification(inquiry.assignedAdmin, {
      type: 'new_message',
      title: 'New Message',
      message: `New message from ${req.user.firstName} ${req.user.lastName}`,
      data: { inquiryId: inquiry._id }
    });
  } else if (isAdmin) {
    await sendNotification(inquiry.customer, {
      type: 'new_message',
      title: 'New Message',
      message: 'You have a new message from TesGold Services',
      data: { inquiryId: inquiry._id }
    });
  }

  res.json({
    success: true,
    data: {
      message: inquiry.messages[inquiry.messages.length - 1]
    }
  });
});

// @desc    Schedule consultation
// @route   POST /api/service-inquiries/:id/consultation
// @access  Private (Admin only)
export const scheduleConsultation = asyncHandler(async (req, res) => {
  const {
    dateTime,
    duration,
    location,
    meetingLink,
    notes
  } = req.body;

  const inquiry = await ServiceInquiry.findById(req.params.id);

  if (!inquiry) {
    throw new AppError('Service inquiry not found', 404);
  }

  // Validate meeting link for online consultations
  if (location === 'online' && !meetingLink) {
    throw new AppError('Meeting link is required for online consultations', 400);
  }

  inquiry.consultation = {
    scheduled: true,
    scheduledBy: req.user.id,
    dateTime: new Date(dateTime),
    duration: parseInt(duration),
    location,
    meetingLink: location === 'online' ? meetingLink : undefined,
    notes: notes || '',
    status: 'scheduled'
  };

  // Assign inquiry to current admin if not assigned
  if (!inquiry.assignedAdmin) {
    inquiry.assignedAdmin = req.user.id;
  }

  await inquiry.save();
  await inquiry.populate('customer', 'firstName lastName email');

  // Notify customer
  await sendNotification(inquiry.customer._id, {
    type: 'consultation_scheduled',
    title: 'Consultation Scheduled',
    message: `A consultation has been scheduled for ${new Date(dateTime).toLocaleDateString()}`,
    data: { inquiryId: inquiry._id, dateTime, location }
  });

  res.json({
    success: true,
    data: {
      inquiry
    }
  });
});

// @desc    Get inquiry statistics for admin
// @route   GET /api/service-inquiries/provider/stats
// @access  Private (Admin only)
export const getInquiryStats = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;

  // Calculate date range
  let dateFilter = {};
  const now = new Date();
  
  switch (period) {
    case '7d':
      dateFilter.createdAt = { $gte: new Date(now.setDate(now.getDate() - 7)) };
      break;
    case '30d':
      dateFilter.createdAt = { $gte: new Date(now.setDate(now.getDate() - 30)) };
      break;
    case '90d':
      dateFilter.createdAt = { $gte: new Date(now.setDate(now.getDate() - 90)) };
      break;
    case '1y':
      dateFilter.createdAt = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
      break;
  }

  const [stats] = await ServiceInquiry.getInquiryStats(dateFilter);

  // Get admin workload
  const adminWorkload = await ServiceInquiry.getAdminWorkload();

  // Calculate response time metrics
  const responseTimeStats = await ServiceInquiry.aggregate([
    { $match: { ...dateFilter, 'analytics.responseTime': { $exists: true } } },
    {
      $group: {
        _id: null,
        avgResponseTime: { $avg: '$analytics.responseTime' },
        minResponseTime: { $min: '$analytics.responseTime' },
        maxResponseTime: { $max: '$analytics.responseTime' }
      }
    }
  ]);

  // Calculate revenue metrics from accepted quotes
  const revenueStats = await ServiceInquiry.aggregate([
    { $match: { ...dateFilter, 'quotes.status': 'accepted' } },
    { $unwind: '$quotes' },
    { $match: { 'quotes.status': 'accepted' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$quotes.amount' },
        avgQuoteValue: { $avg: '$quotes.amount' },
        totalProjects: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      period,
      ...stats,
      adminWorkload,
      responseTime: responseTimeStats[0] || {},
      revenue: revenueStats[0] || {}
    }
  });
});

// @desc    Assign inquiry to admin
// @route   PUT /api/service-inquiries/:id/assign
// @access  Private (Admin only)
export const assignInquiry = asyncHandler(async (req, res) => {
  const { adminId } = req.body;

  const inquiry = await ServiceInquiry.findById(req.params.id);

  if (!inquiry) {
    throw new AppError('Service inquiry not found', 404);
  }

  // Verify admin exists
  const admin = await User.findOne({ _id: adminId, userType: 'admin' });
  if (!admin) {
    throw new AppError('Admin user not found', 404);
  }

  inquiry.assignedAdmin = adminId;
  
  // Add to status history
  inquiry.statusHistory.push({
    status: inquiry.status,
    changedBy: req.user.id,
    note: `Inquiry assigned to ${admin.firstName} ${admin.lastName}`
  });

  await inquiry.save();

  // Notify assigned admin
  await sendNotification(adminId, {
    type: 'inquiry_assigned',
    title: 'Inquiry Assigned',
    message: `You have been assigned to handle inquiry ${inquiry.inquiryNumber}`,
    data: { inquiryId: inquiry._id }
  });

  res.json({
    success: true,
    data: {
      inquiry
    }
  });
});

// @desc    Add internal note
// @route   POST /api/service-inquiries/:id/internal-note
// @access  Private (Admin only)
export const addInternalNote = asyncHandler(async (req, res) => {
  const { note } = req.body;

  const inquiry = await ServiceInquiry.findById(req.params.id);

  if (!inquiry) {
    throw new AppError('Service inquiry not found', 404);
  }

  inquiry.internalNotes.push({
    note,
    addedBy: req.user.id
  });

  await inquiry.save();

  res.json({
    success: true,
    message: 'Internal note added successfully'
  });
});