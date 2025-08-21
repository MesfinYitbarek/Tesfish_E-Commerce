import express from 'express';
import {
  createBooking,
  getMyBookings,
  getSellerBookings,
  updateBookingStatus,
  getAvailableSlots
} from '../../controllers/booking/bookingController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/seller/bookings', protect, authorize('company', 'individual'), getSellerBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.get('/available-slots/:sellerId', getAvailableSlots);

export default router;