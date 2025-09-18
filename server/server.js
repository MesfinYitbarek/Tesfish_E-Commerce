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
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from './routes/auth/authRoutes.js';
import productRoutes from './routes/product/productRoutes.js';
import paymentRoutes from './routes/payment/paymentRoutes.js';
import bookingRoutes from './routes/booking/bookingRoutes.js';
import chatRoutes from './routes/chat/chatRoutes.js';
import reviewRoutes from './routes/review/reviewRoutes.js';
import notificationRoutes from './routes/notification/notificationRoutes.js';
import serviceInquiryRoutes from './routes/service/serviceInquiryRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import userRoutes from './routes/user/userRoutes.js';
import categoryRoutes from './routes/category/categoryRoutes.js';
import propertyRegistrationRoutes from './routes/property/propertyRegistrationRoutes.js';
import appointmentRoutes from './routes/property/appointmentRoutes.js';

// Middleware
import { errorHandler, notFound } from './middleware/error/errorMiddleware.js';
import { protect } from './middleware/auth/authMiddleware.js';

// Utils
import connectDB from './config/database.js';
import { initializeSocket } from './config/socket.js';
import { injectSocketIO } from './controllers/chat/chatController.js';

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Init socket
initializeSocket(io);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": [
          "'self'",
          "data:",
          "https://res.cloudinary.com", // Cloudinary images
          "https://images.unsplash.com", // Unsplash images
          "https://plus.unsplash.com"    // (sometimes Unsplash uses this domain)
        ],
        "script-src": [
          "'self'",
          "'unsafe-inline'", // Google adds inline snippets
          "https://accounts.google.com",
          "https://apis.google.com"
        ],
        "script-src-elem": [
          "'self'",
          "'unsafe-inline'",
          "https://accounts.google.com",
          "https://apis.google.com"
        ],
        "frame-src": [
          "'self'",
          "https://accounts.google.com"
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session
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
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Compression & logging
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// ---------------- API ROUTES ----------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', injectSocketIO(io), chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/service-inquiries', serviceInquiryRoutes);
app.use('/api/admin', protect, adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/property-registrations', propertyRegistrationRoutes);
app.use('/api/appointments', appointmentRoutes);

// ✅ Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- FRONTEND ----------------
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, "index.html"));
  });
}

// ---------------- ERRORS ----------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
📊 Database: ${process.env.MONGODB_URI}
🌐 Client URL: ${process.env.CLIENT_URL || "*" }
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
