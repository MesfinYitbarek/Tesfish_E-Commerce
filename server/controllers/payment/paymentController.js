import Payment from '../../models/Payment.js';
import Order from '../../models/Order.js';
import Booking from '../../models/Booking.js';
import { processTelebirrPayment, processPayPalPayment } from '../../utils/payment/paymentService.js';

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
export const processPayment = async (req, res) => {
  try {
    const {
      orderId,
      bookingId,
      amount,
      paymentMethod,
      paymentData
    } = req.body;

    let relatedOrder = null;
    let relatedBooking = null;
    let payee = null;

    // Validate order or booking
    if (orderId) {
      relatedOrder = await Order.findById(orderId).populate('items.seller');
      if (!relatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      payee = relatedOrder.items[0].seller._id; // Assuming single seller for now
    }

    if (bookingId) {
      relatedBooking = await Booking.findById(bookingId);
      if (!relatedBooking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      payee = relatedBooking.seller;
    }

    if (!payee) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment request'
      });
    }

    // Calculate platform fee (e.g., 3% of transaction)
    const platformFee = amount * 0.03;
    const netAmount = amount - platformFee;

    // Create payment record
    const payment = await Payment.create({
      paymentId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: orderId,
      booking: bookingId,
      payer: req.user.id,
      payee,
      amount,
      paymentMethod,
      platformFee,
      netAmount,
      status: 'pending'
    });

    let paymentResult;

    try {
      // Process payment based on method
      switch (paymentMethod) {
        case 'stripe':
          paymentResult = await processStripePayment({
            amount,
            currency: 'ETB',
            paymentMethodId: paymentData.paymentMethodId,
            metadata: {
              paymentId: payment.paymentId,
              orderId,
              bookingId
            }
          });
          break;

        case 'telebirr':
          paymentResult = await processTelebirrPayment({
            amount,
            phone: paymentData.phone,
            reference: payment.paymentId
          });
          break;

        case 'paypal':
          paymentResult = await processPayPalPayment({
            amount,
            currency: 'USD', // PayPal might require USD
            reference: payment.paymentId
          });
          break;

        default:
          throw new Error('Unsupported payment method');
      }

      // Update payment status
      if (paymentResult.success) {
        payment.status = 'completed';
        payment.externalPaymentId = paymentResult.transactionId;
        payment.gatewayResponse = paymentResult.response;
        payment.paidAt = new Date();

        // Update related order/booking
        if (relatedOrder) {
          relatedOrder.paymentStatus = 'paid';
          relatedOrder.paymentId = payment.paymentId;
          relatedOrder.status = 'confirmed';
          await relatedOrder.save();
        }

        if (relatedBooking) {
          relatedBooking.paymentStatus = 'paid';
          relatedBooking.paymentId = payment.paymentId;
          relatedBooking.status = 'confirmed';
          await relatedBooking.save();
        }
      } else {
        payment.status = 'failed';
        payment.gatewayResponse = paymentResult.error;
      }

      await payment.save();

      res.status(paymentResult.success ? 200 : 400).json({
        success: paymentResult.success,
        message: paymentResult.success ? 'Payment processed successfully' : 'Payment failed',
        data: { 
          payment,
          transactionId: paymentResult.transactionId
        }
      });

    } catch (paymentError) {
      console.error('Payment processing error:', paymentError);
      
      payment.status = 'failed';
      payment.gatewayResponse = { error: paymentError.message };
      await payment.save();

      res.status(500).json({
        success: false,
        message: 'Payment processing failed',
        error: paymentError.message
      });
    }
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing payment'
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('payer', 'customerProfile email')
      .populate('payee', 'companyProfile individualProfile email')
      .populate('order')
      .populate('booking');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    const isAuthorized = payment.payer._id.toString() === req.user.id || 
                        payment.payee._id.toString() === req.user.id ||
                        req.user.userType === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.status(200).json({
      success: true,
      data: { payment }
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment'
    });
  }
};

// @desc    Get user's payments
// @route   GET /api/payments/my-payments
// @access  Private
export const getMyPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { payer: req.user.id },
        { payee: req.user.id }
      ]
    };

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Type filter (sent/received)
    if (req.query.type === 'sent') {
      query.payer = req.user.id;
      delete query.$or;
    } else if (req.query.type === 'received') {
      query.payee = req.user.id;
      delete query.$or;
    }

    const payments = await Payment.find(query)
      .populate('payer', 'customerProfile companyProfile individualProfile')
      .populate('payee', 'companyProfile individualProfile')
      .populate('order', 'orderNumber total')
      .populate('booking', 'bookingType appointmentDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPayments: total
        }
      }
    });
  } catch (error) {
    console.error('Get my payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payments'
    });
  }
};

// @desc    Request refund
// @route   POST /api/payments/:id/refund
// @access  Private
export const requestRefund = async (req, res) => {
  try {
    const { reason, amount } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    if (payment.payer.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to request refund for this payment'
      });
    }

    // Check if payment is eligible for refund
    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded'
      });
    }

    const refundAmount = amount || payment.amount;
    if (refundAmount > payment.amount - payment.refundAmount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount exceeds available amount'
      });
    }

    // Process refund (implement gateway-specific refund logic)
    // For now, just update the payment record
    payment.refundAmount += refundAmount;
    payment.refundReason = reason;
    payment.refundDate = new Date();
    
    if (payment.refundAmount >= payment.amount) {
      payment.status = 'refunded';
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Refund request processed successfully',
      data: { payment }
    });
  } catch (error) {
    console.error('Request refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing refund'
    });
  }
};