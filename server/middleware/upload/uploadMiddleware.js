// middleware/upload/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads/temp';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'images': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    'videos': ['video/mp4', 'video/webm', 'video/mov', 'video/avi'],
    'documents': [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ]
  };

  // Get all allowed types
  const allAllowedTypes = [
    ...allowedTypes.images,
    ...allowedTypes.videos,
    ...allowedTypes.documents
  ];

  // Remove duplicates
  const uniqueAllowedTypes = [...new Set(allAllowedTypes)];

  if (uniqueAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${uniqueAllowedTypes.join(', ')}`), false);
  }
};

// Base multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
    files: 50 // Max 50 files
  }
});

// Export different middleware configurations
export const uploadMiddleware = upload.fields([
  { name: 'images', maxCount: 20 },
  { name: 'videos', maxCount: 5 },
  { name: 'documents', maxCount: 10 }
]);

// Export base upload instance with correct syntax
export const baseUpload = upload;

// Specific configurations for different use cases
export const uploadConfigs = {
  // For single file upload
  single: (fieldName) => upload.single(fieldName),
  
  // For multiple files of same type
  array: (fieldName, maxCount = 10) => upload.array(fieldName, maxCount),
  
  // For multiple different field types
  fields: (fieldsConfig) => upload.fields(fieldsConfig),
  
  // Common configurations
  profileImage: upload.single('profileImage'),
  attachments: upload.array('attachments', 5),
  galleryImages: upload.array('images', 20),
  productMedia: upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'videos', maxCount: 5 },
    { name: 'documents', maxCount: 10 }
  ]),
  serviceAttachments: upload.array('attachments', 5),
  registrationDocuments: upload.array('documents', 5)
};

// Export the base upload instance (alternative way)
export { upload };

// Default export for main product upload
export default uploadMiddleware;