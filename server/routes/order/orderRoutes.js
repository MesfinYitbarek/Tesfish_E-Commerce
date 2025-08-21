import express from 'express';
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} from '../../controllers/order/orderController.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../../controllers/cart/cartController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Order routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/seller/orders', protect, authorize('company', 'individual'), getSellerOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

// Cart routes
router.get('/cart', protect, getCart);
router.post('/cart/add', protect, addToCart);
router.put('/cart/update', protect, updateCartItem);
router.delete('/cart/remove/:productId', protect, removeFromCart);
router.delete('/cart/clear', protect, clearCart);

export default router;