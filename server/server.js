import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
// import { injectSocketIO } from '../controllers/chat/chatController.js';
// Import routes
import authRoutes from './routes/auth/authRoutes.js';
import cartRoutes from './routes/cart/cartRoutes.js';
import productRoutes from './routes/product/productRoutes.js';
import orderRoutes from './routes/order/orderRoutes.js';
import paymentRoutes from './routes/payment/paymentRoutes.js';
import bookingRoutes from './routes/booking/bookingRoutes.js';
import chatRoutes from './routes/chat/chatRoutes.js';
import reviewRoutes from './routes/review/reviewRoutes.js';
import notificationRoutes from './routes/notification/notificationRoutes.js';
import serviceInquiryRoutes from './routes/service/serviceInquiryRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import userRoutes from './routes/user/userRoutes.js';
import categoryRoutes from './routes/category/categoryRoutes.js';

// Import middleware
import { errorHandler, notFound } from './middleware/error/errorMiddleware.js';
import { protect } from './middleware/auth/authMiddleware.js';

// Import utils
import connectDB from './config/database.js';
import { initializeSocket } from './config/socket.js';
import { injectSocketIO } from './controllers/chat/chatController.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Initialize Socket.io
initializeSocket(io);

// Security middleware
app.use(helmet());
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  // Skip req.query to avoid Express 5 error
  next();
});


// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Compression and logging
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', injectSocketIO(io), chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/service-inquiries', serviceInquiryRoutes);
app.use('/api/admin', protect, adminRoutes);
app.use('/api/categories', categoryRoutes);
// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
📊 Database: ${process.env.MONGODB_URI}
🌐 Client URL: ${process.env.CLIENT_URL}
⚡ Socket.io enabled
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

export default app;