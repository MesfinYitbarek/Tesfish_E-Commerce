import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getMe,
  updateProfile
} from '../../controllers/auth/authController.js';
import { googleLogin } from '../../controllers/auth/googleAuthController.js'; // ✅ import google login controller
import { protect } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('userType').isIn(['company', 'individual', 'customer'])
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

const googleLoginValidation = [
  body('token').notEmpty().withMessage('Google ID token is required') // ✅ validate token
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
