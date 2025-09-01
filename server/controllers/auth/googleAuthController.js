// controllers/auth/googleAuthController.js
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../../models/User.js';
import { generateToken } from '../../utils/helpers/tokenHelper.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token: idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'No token provided' });
    }

    // Verify with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    const { email, sub: googleId, name, picture } = payload;

    // Check if user already exists with GoogleId
    let user = await User.findOne({ googleId });

    if (!user) {
      // If user exists by email (registered before), link GoogleId
      user = await User.findOne({ email });

      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        // New user → create account
        user = await User.create({
          email,
          googleId,
          password: crypto.randomBytes(16).toString('hex'), // dummy password
          userType: 'customer',
          isVerified: true,
          customerProfile: {
            firstName: name?.split(' ')[0] || '',
            lastName: name?.split(' ')[1] || '',
            avatar: picture
          }
        });
      }
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.cookie('token', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          userType: user.userType,
          fullName: user.fullName,
          isVerified: user.isVerified,
          subscriptionStatus: user.subscriptionStatus
        }
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google login'
    });
  }
};
