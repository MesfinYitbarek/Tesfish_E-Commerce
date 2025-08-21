import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config()
console.log('Cloudinary Key:', process.env.CLOUDINARY_API_KEY);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
export const uploadToCloudinary = async (filePath, folder = 'general') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `citilights/${folder}`,
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto'
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    // Delete local file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleToCloudinary = async (filePaths, folder = 'general') => {
  try {
    const uploadPromises = filePaths.map(filePath => uploadToCloudinary(filePath, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    // Clean up any remaining files
    filePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    throw error;
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Upload file from URL
export const uploadFromUrl = async (url, folder = 'general') => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: `citilights/${folder}`,
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto'
    });

    return result;
  } catch (error) {
    console.error('Cloudinary URL upload error:', error);
    throw error;
  }
};