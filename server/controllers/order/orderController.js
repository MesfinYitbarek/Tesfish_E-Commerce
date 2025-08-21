import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import Cart from '../../models/Cart.js';
import { sendEmail } from '../../utils/email/emailService.js';
import { processPayment } from '../../utils/payment/paymentService.js';

// @desc    Create order
// @route   POST /api/orders
// @access  Private (Customers only)
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      customerInfo,
      shippingAddress,
      billingAddress,
      paymentMethod,
      orderType = 'purchase'
    } = req.body;

    // Validate and calculate order total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `Product is not available: ${product.title}`
        });
      }

      // Check inventory for physical products
      if (product.productType === 'physical' && product.inventory.trackInventory) {
        if (product.inventory.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.title}`
          });
        }
      }

      const itemPrice = product.pricing.salePrice || product.pricing.basePrice;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        seller: product.seller,
        quantity: item.quantity,
        price: itemPrice,
        variant: item.variant,
        specifications: item.specifications
      });
    }

    // Calculate tax and shipping (implement your logic)
    const tax = subtotal * 0.15; // 15% tax
    const shipping = orderType === 'purchase' ? 50 : 0; // Flat shipping rate
    const total = subtotal + tax + shipping;

    // Create order
    const orderData = {
      customer: req.user.id,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      customerInfo: customerInfo || {
        firstName: req.user.customerProfile?.firstName,
        lastName: req.user.customerProfile?.lastName,
        email: req.user.email,
        phone: req.user.customerProfile?.phone
      },
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      orderType
    };

    const order = await Order.create(orderData);

    // Process payment if required
    if (paymentMethod !== 'cash-on-delivery') {
      try {
        const paymentResult = await processPayment({
          orderId: order._id,
          amount: total,
          paymentMethod,
          customerInfo: orderData.customerInfo
        });

        if (paymentResult.success) {
          order.paymentStatus = 'paid';
          order.paymentId = paymentResult.paymentId;
          order.status = 'confirmed';
        } else {
          order.paymentStatus = 'failed';
          order.status = 'cancelled';
        }
      } catch (paymentError) {
        console.error('Payment processing error:', paymentError);
        order.paymentStatus = 'failed';
        order.status = 'cancelled';
      }

      await order.save();
    }

    // Update inventory for confirmed orders
    if (order.status === 'confirmed') {
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product.productType === 'physical' && product.inventory.trackInventory) {
          product.inventory.stock -= item.quantity;
          product.totalSales += item.quantity;
          await product.save();
        }
      }

      // Clear user's cart
      await Cart.findOneAndDelete({ customer: req.user.id });
    }

    // Send order confirmation email
    await sendEmail({
      to: orderData.customerInfo.email,
      subject: 'Order Confirmation - CitiLights',
      template: 'orderConfirmation',
      data: {
        orderNumber: order.orderNumber,
        customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        items: orderItems,
        total: total
      }
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'title media pricing')
      .populate('items.seller', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: populatedOrder }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { customer: req.user.id };

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'title media pricing')
      .populate('items.seller', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total
        }
      }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Get seller's orders
// @route   GET /api/orders/seller/orders
// @access  Private (Sellers only)
export const getSellerOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ 'items.seller': req.user.id })
      .populate('customer', 'customerProfile.firstName customerProfile.lastName email')
      .populate('items.product', 'title media pricing')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ 'items.seller': req.user.id });

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total
        }
      }
    });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching seller orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'customerProfile email')
      .populate('items.product', 'title media pricing')
      .populate('items.seller', 'companyProfile individualProfile');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    const isCustomer = order.customer._id.toString() === req.user.id;
    const isSeller = order.items.some(item => item.seller._id.toString() === req.user.id);
    const isAdmin = req.user.userType === 'admin';

    if (!isCustomer && !isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Sellers and Admins)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    const isSeller = order.items.some(item => item.seller.toString() === req.user.id);
    const isAdmin = req.user.userType === 'admin';

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Update order
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note
    });

    await order.save();

    // Send status update email to customer
    await sendEmail({
      to: order.customerInfo.email,
      subject: `Order Update - ${order.orderNumber}`,
      template: 'orderStatusUpdate',
      data: {
        orderNumber: order.orderNumber,
        status,
        trackingNumber,
        note
      }
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    const isCustomer = order.customer.toString() === req.user.id;
    const isAdmin = req.user.userType === 'admin';

    if (!isCustomer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.adminNotes = reason;
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: reason
    });

    // Restore inventory
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product && product.productType === 'physical' && product.inventory.trackInventory) {
        product.inventory.stock += item.quantity;
        product.totalSales -= item.quantity;
        await product.save();
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
};