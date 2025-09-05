import { validationResult } from "express-validator";
import slugify from "slugify";
import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import User from "../../models/User.js";
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/upload/cloudinaryService.js";

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "companyProfile individualProfile sellerRating")
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};

// @desc    Get products for admin
// @route   GET /api/products/admin
// @access  Private (admin only)
// @desc    Get products for admin (with filters, pagination, sorting)
// @route   GET /api/products/admin/all
// @access  Private
export const getProductsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // ✅ Helper to validate query params
    const isValid = (val) =>
      val && val !== "undefined" && val !== "null" && val !== "";

    // Initialize empty query object (no "active" restriction for admin)
    let query = {};

    // Search
    if (isValid(req.query.search)) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (isValid(req.query.category)) {
      query.category = req.query.category;
    }

    // Status filter
    if (isValid(req.query.status)) {
      query.status = req.query.status;
    }

    // Price range
    if (isValid(req.query.minPrice) || isValid(req.query.maxPrice)) {
      query["pricing.basePrice"] = {};
      if (isValid(req.query.minPrice)) {
        query["pricing.basePrice"].$gte = Number(req.query.minPrice);
      }
      if (isValid(req.query.maxPrice)) {
        query["pricing.basePrice"].$lte = Number(req.query.maxPrice);
      }
    }

    // Product type
    if (isValid(req.query.productType)) {
      query.productType = req.query.productType;
    }

    // Location filter for real estate
    if (isValid(req.query.city)) {
      query["realEstateDetails.location.city"] = new RegExp(
        req.query.city,
        "i"
      );
    }

    // Seller filter
    if (isValid(req.query.seller)) {
      query.seller = req.query.seller;
    }

    // Sorting
    let sort = {};
    switch (req.query.sort) {
      case "price-low":
        sort = { "pricing.basePrice": 1 };
        break;
      case "price-high":
        sort = { "pricing.basePrice": -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "popular":
        sort = { views: -1 };
        break;
      case "status":
        sort = { status: 1, createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Fetch products
    const products = await Product.find(query)
      .populate(
        "seller",
        "companyProfile.companyName individualProfile.firstName individualProfile.lastName email userType"
      )
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Pagination count
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};


// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Product owner only)
export const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
          value: err.value,
        })),
      });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (
      product.seller.toString() !== req.user.id &&
      req.user.userType !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    // Parse JSON fields for update
    const parsedFields = [
      "pricing",
      "inventory",
      "realEstateDetails",
      "shipping",
      "seo",
      "specifications",
      "variants",
    ];

    parsedFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        try {
          req.body[field] = req.body[field]
            ? JSON.parse(req.body[field])
            : field === "specifications" || field === "variants"
            ? []
            : {};
        } catch (e) {
          console.warn(`Invalid JSON for ${field}:`, e.message);
        }
      }
    });

    // Use the converted price from validation middleware if available
    const updateData = {
      ...req.body,
      pricing: {
        ...req.body.pricing,
        basePrice: req.convertedBasePrice || req.body.pricing.basePrice,
      },
    };

    // Update slug if title changed
    if (req.body.title && req.body.title !== product.title) {
      updateData.slug = slugify(req.body.title, { lower: true, strict: true });

      // Ensure unique slug
      let slug = updateData.slug;
      let counter = 1;
      while (await Product.findOne({ slug, _id: { $ne: product._id } })) {
        slug = `${updateData.slug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file) =>
        uploadToCloudinary(file.path, "products")
      );
      const uploadedImages = await Promise.all(imagePromises);

      const newImages = uploadedImages.map((img, index) => ({
        url: img.secure_url,
        publicId: img.public_id,
        alt: `${req.body.title || product.title} - Image ${index + 1}`,
        isPrimary: false,
      }));

      updateData.media = {
        ...product.media.toObject(),
        images: [...(product.media.images || []), ...newImages],
      };
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Update product error:", error);

    // Handle validation errors from Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Product owner only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (
      product.seller.toString() !== req.user.id &&
      req.user.userType !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    // Delete images from cloudinary
    if (product.media.images && product.media.images.length > 0) {
      const deletePromises = product.media.images.map((img) => {
        if (img.publicId) {
          return deleteFromCloudinary(img.publicId);
        }
        // Fallback for old format without publicId
        const publicId = img.url.split("/").pop().split(".")[0];
        return deleteFromCloudinary(publicId);
      });
      await Promise.all(deletePromises);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};


// @desc    Get seller's products
// @route   GET /api/products/seller/my-products
// @access  Private (Sellers only)
export const getMyProducts = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Ensure user ID is properly converted to ObjectId for consistency
    const sellerId = new mongoose.Types.ObjectId(req.user.id);
    
    // Build query object
    const query = { seller: sellerId };

    // Status filter - FIX: properly check for undefined/null values
    if (req.query.status && 
        req.query.status !== 'all' && 
        req.query.status !== 'undefined' && 
        req.query.status !== 'null') {
      query.status = req.query.status;
    }

    // Product type filter - FIX: properly check for undefined/null values
    if (req.query.productType && 
        req.query.productType !== 'all' && 
        req.query.productType !== 'undefined' && 
        req.query.productType !== 'null') {
      query.productType = req.query.productType;
    }

    // Category filter
    if (req.query.category && 
        req.query.category !== 'undefined' && 
        req.query.category !== 'null') {
      query.category = new mongoose.Types.ObjectId(req.query.category);
    }

    // Search filter
    if (req.query.search && 
        req.query.search !== 'undefined' && 
        req.query.search !== 'null' && 
        req.query.search.trim() !== '') {
      query.$or = [
        { title: { $regex: req.query.search.trim(), $options: 'i' } },
        { description: { $regex: req.query.search.trim(), $options: 'i' } },
        { brand: { $regex: req.query.search.trim(), $options: 'i' } }
      ];
    }

    // Date range filter
    if (req.query.dateFrom || req.query.dateTo) {
      query.createdAt = {};
      if (req.query.dateFrom && req.query.dateFrom !== 'undefined') {
        query.createdAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo && req.query.dateTo !== 'undefined') {
        query.createdAt.$lte = new Date(req.query.dateTo);
      }
    }

    console.log('Final Query:', JSON.stringify(query, null, 2)); // Debug log

    // Sort options
    let sortOption = { createdAt: -1 }; // Default sort by newest
    if (req.query.sortBy && req.query.sortBy !== 'undefined') {
      switch (req.query.sortBy) {
        case 'title':
          sortOption = { title: 1 };
          break;
        case 'price_low':
          sortOption = { 'pricing.basePrice': 1 };
          break;
        case 'price_high':
          sortOption = { 'pricing.basePrice': -1 };
          break;
        case 'views':
          sortOption = { views: -1 };
          break;
        case 'sales':
          sortOption = { totalSales: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    // Execute the main query with proper population
    const products = await Product.find(query)
      .populate({
        path: "category",
        select: "name slug description"
      })
      .populate({
        path: "subcategory", 
        select: "name slug description"
      })
      .populate({
        path: "seller",
        select: "displayName email avatar companyProfile.companyName"
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    console.log(`Found ${products.length} products for user ${req.user.id}`); // Debug log

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Get comprehensive statistics
    const stats = await Product.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$pricing.basePrice' },
          averagePrice: { $avg: '$pricing.basePrice' },
          totalViews: { $sum: '$views' },
          totalSales: { $sum: '$totalSales' }
        }
      }
    ]);

    // Get product type distribution
    const typeStats = await Product.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: '$productType',
          count: { $sum: 1 },
          totalValue: { $sum: '$pricing.basePrice' }
        }
      }
    ]);

    // Get overall seller statistics
    const overallStats = await Product.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: { $sum: '$pricing.basePrice' },
          averagePrice: { $avg: '$pricing.basePrice' },
          totalViews: { $sum: '$views' },
          totalSales: { $sum: '$totalSales' },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          draftProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          soldProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] }
          }
        }
      }
    ]);

    // Process products to add computed fields
    const processedProducts = products.map(product => ({
      ...product,
      // Add virtual fields manually since we're using lean()
      isAvailable: product.status === 'active' && 
                   (!product.inventory?.trackInventory || product.inventory?.stock > 0),
      displayPrice: product.pricing?.salePrice || product.pricing?.basePrice,
      
      // Add status indicators
      isLowStock: product.inventory?.trackInventory && 
                  product.inventory?.stock <= product.inventory?.lowStockThreshold,
      stockStatus: !product.inventory?.trackInventory ? 'unlimited' :
                   product.inventory?.stock === 0 ? 'out-of-stock' :
                   product.inventory?.stock <= product.inventory?.lowStockThreshold ? 'low-stock' : 'in-stock',
      
      // Add primary image
      primaryImage: product.media?.images?.find(img => img.isPrimary)?.url || 
                    product.media?.images?.[0]?.url || null,
      
      // Add formatted dates
      createdAtFormatted: new Date(product.createdAt).toLocaleDateString(),
      updatedAtFormatted: new Date(product.updatedAt).toLocaleDateString()
    }));

    // Clean up filter values for response
    const cleanFilters = {
      status: (req.query.status && req.query.status !== 'undefined' && req.query.status !== 'null') 
              ? req.query.status : 'all',
      productType: (req.query.productType && req.query.productType !== 'undefined' && req.query.productType !== 'null') 
                   ? req.query.productType : 'all',
      category: (req.query.category && req.query.category !== 'undefined' && req.query.category !== 'null') 
                ? req.query.category : null,
      search: (req.query.search && req.query.search !== 'undefined' && req.query.search !== 'null') 
              ? req.query.search : null,
      sortBy: (req.query.sortBy && req.query.sortBy !== 'undefined') 
              ? req.query.sortBy : 'newest'
    };

    // Response data
    const responseData = {
      products: processedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
        limit
      },
      statistics: {
        byStatus: stats,
        byType: typeStats,
        overall: overallStats[0] || {
          totalProducts: 0,
          totalValue: 0,
          averagePrice: 0,
          totalViews: 0,
          totalSales: 0,
          activeProducts: 0,
          draftProducts: 0,
          soldProducts: 0
        }
      },
      filters: {
        appliedFilters: cleanFilters
      }
    };

    res.status(200).json({
      success: true,
      message: `Retrieved ${processedProducts.length} products`,
      data: responseData,
    });

  } catch (error) {
    console.error("Get my products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching your products",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private (Admin only)
export const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $facet: {
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalValue: { $sum: '$pricing.basePrice' }
              }
            }
          ],
          byType: [
            {
              $group: {
                _id: '$productType',
                count: { $sum: 1 },
                avgPrice: { $avg: '$pricing.basePrice' }
              }
            }
          ],
          byCategory: [
            {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryInfo'
              }
            },
            {
              $group: {
                _id: '$category',
                categoryName: { $first: '$categoryInfo.name' },
                count: { $sum: 1 },
                avgPrice: { $avg: '$pricing.basePrice' }
              }
            }
          ],
          overview: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalValue: { $sum: '$pricing.basePrice' },
                avgPrice: { $avg: '$pricing.basePrice' },
                totalViews: { $sum: '$views' }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error("Get product stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product statistics",
    });
  }
};


// @desc    Get all products with advanced filtering
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: "active" };

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Product type filter (homes, plots, commercials, others)
    if (req.query.productType) {
      query.productType = req.query.productType;
    }

    // Sub product type filter
    if (req.query.subProductType) {
      query.subProductType = req.query.subProductType;
    }

    // Listing type filter (sell, rent)
    if (req.query.listingType) {
      query.listingType = req.query.listingType;
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query["pricing.basePrice"] = {};
      if (req.query.minPrice)
        query["pricing.basePrice"].$gte = Number(req.query.minPrice);
      if (req.query.maxPrice)
        query["pricing.basePrice"].$lte = Number(req.query.maxPrice);
    }

    // Location filters
    if (req.query.city) {
      query["propertyDetails.location.city"] = new RegExp(req.query.city, "i");
    }
    if (req.query.region) {
      query["propertyDetails.location.region"] = new RegExp(req.query.region, "i");
    }

    // Property specific filters
    if (req.query.bedrooms) {
      query["propertyDetails.bedrooms"] = parseInt(req.query.bedrooms);
    }
    if (req.query.bathrooms) {
      query["propertyDetails.bathrooms"] = parseInt(req.query.bathrooms);
    }
    if (req.query.minArea) {
      query["propertyDetails.area.value"] = { $gte: Number(req.query.minArea) };
    }
    if (req.query.maxArea) {
      query["propertyDetails.area.value"] = { 
        ...query["propertyDetails.area.value"],
        $lte: Number(req.query.maxArea) 
      };
    }

    // Property features
    if (req.query.features) {
      const features = Array.isArray(req.query.features) ? req.query.features : [req.query.features];
      query["propertyDetails.features"] = { $in: features };
    }

    // Furnishing status
    if (req.query.furnishingStatus) {
      query["propertyDetails.furnishingStatus"] = req.query.furnishingStatus;
    }

    // Seller type
    if (req.query.sellerType) {
      query.sellerType = req.query.sellerType;
    }

    // Featured/Promoted
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }
    if (req.query.promoted === 'true') {
      query.isPromoted = true;
    }

    // Condition filter
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    // Brand filter
    if (req.query.brand) {
      query.brand = new RegExp(req.query.brand, "i");
    }

    // Year built range
    if (req.query.minYear || req.query.maxYear) {
      query["propertyDetails.yearBuilt"] = {};
      if (req.query.minYear)
        query["propertyDetails.yearBuilt"].$gte = Number(req.query.minYear);
      if (req.query.maxYear)
        query["propertyDetails.yearBuilt"].$lte = Number(req.query.maxYear);
    }

    // Sorting
    let sort = {};
    switch (req.query.sort) {
      case "price-low":
        sort = { "pricing.basePrice": 1 };
        break;
      case "price-high":
        sort = { "pricing.basePrice": -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "popular":
        sort = { views: -1 };
        break;
      case "area-small":
        sort = { "propertyDetails.area.value": 1 };
        break;
      case "area-large":
        sort = { "propertyDetails.area.value": -1 };
        break;
      case "featured":
        sort = { isFeatured: -1, isPromoted: -1, createdAt: -1 };
        break;
      default:
        sort = { isFeatured: -1, isPromoted: -1, createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate("seller", "companyProfile.companyName individualProfile.firstName individualProfile.lastName displayName email avatar")
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get aggregated data for filters
    const aggregations = await Product.aggregate([
      { $match: { status: "active" } },
      {
        $facet: {
          priceRange: [
            {
              $group: {
                _id: null,
                minPrice: { $min: "$pricing.basePrice" },
                maxPrice: { $max: "$pricing.basePrice" },
                avgPrice: { $avg: "$pricing.basePrice" }
              }
            }
          ],
          cities: [
            { $group: { _id: "$propertyDetails.location.city", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
          ],
          propertyTypes: [
            { $group: { _id: "$subProductType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          bedroomCounts: [
            { $group: { _id: "$propertyDetails.bedrooms", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        filters: aggregations[0] || {}
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

// @desc    Create product with enhanced property support
// @route   POST /api/products
// @access  Private (Sellers only)
export const createProduct = async (req, res) => {
  try {
    // Parse JSON fields
    const parsedFields = [
      "pricing",
      "inventory", 
      "propertyDetails",
      "businessDetails",
      "vehicleDetails",
      "equipmentDetails",
      "contactInfo",
      "viewingDetails",
      "shipping",
      "seo",
      "specifications"
    ];

    parsedFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        try {
          req.body[field] = req.body[field] ? JSON.parse(req.body[field]) : {};
        } catch (e) {
          console.warn(`Invalid JSON for ${field}:`, e.message);
          req.body[field] = {};
        }
      }
    });

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.files?.length > 0) {
        await Promise.all(
          req.files.map(file => 
            fs.promises.unlink(file.path).catch(console.error)
          )
        );
      }

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Get seller information
    const seller = await User.findById(req.user.id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    // Build product data
    const productData = {
      ...req.body,
      seller: req.user.id,
      sellerType: req.user.userType,
      slug: slugify(req.body.title, { lower: true, strict: true }),
    };

    // Set default contact info if not provided
    if (!productData.contactInfo?.email) {
      productData.contactInfo = {
        ...productData.contactInfo,
        email: seller.email,
        phone: seller.phone || seller.companyProfile?.phone || seller.individualProfile?.phone
      };
    }

    // Handle file uploads
    if (req.files?.length > 0) {
      try {
        const imagePromises = req.files.map((file) =>
          uploadToCloudinary(file.path, "products")
        );
        const uploadedImages = await Promise.all(imagePromises);

        productData.media = {
          images: uploadedImages.map((img, index) => ({
            url: img.secure_url,
            publicId: img.public_id,
            alt: `${req.body.title} - Image ${index + 1}`,
            isPrimary: index === 0,
          })),
          ...productData.media
        };

        // Clean up local files
        await Promise.all(
          req.files.map(file => 
            fs.promises.unlink(file.path).catch(console.error)
          )
        );
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload product images",
        });
      }
    }

    // Generate unique slug
    let slug = productData.slug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${productData.slug}-${counter++}`;
    }
    productData.slug = slug;

    // Create product
    const product = await Product.create(productData);

    // Update category product count
    if (product.category) {
      await Category.findByIdAndUpdate(
        product.category,
        { $inc: { 'stats.productCount': 1 } }
      );
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });

  } catch (error) {
    console.error("Create product error:", error);

    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Duplicate product" 
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update product status (sold/unsold)
// @route   PUT /api/products/:id/status
// @access  Private (Product owner only)
export const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id && req.user.userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    const oldStatus = product.status;
    product.status = status;

    // Update availability based on status
    if (status === 'sold' || status === 'rented') {
      product.availability.isAvailable = false;
    } else if (status === 'active') {
      product.availability.isAvailable = true;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: `Product status updated from ${oldStatus} to ${status}`,
      data: { product },
    });
  } catch (error) {
    console.error("Update product status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product status",
    });
  }
};

// @desc    Get property types and their counts
// @route   GET /api/products/property-types
// @access  Public
export const getPropertyTypes = async (req, res) => {
  try {
    const propertyTypes = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: {
            productType: '$productType',
            subProductType: '$subProductType'
          },
          count: { $sum: 1 },
          avgPrice: { $avg: '$pricing.basePrice' },
          minPrice: { $min: '$pricing.basePrice' },
          maxPrice: { $max: '$pricing.basePrice' }
        }
      },
      {
        $group: {
          _id: '$_id.productType',
          subTypes: {
            $push: {
              type: '$_id.subProductType',
              count: '$count',
              avgPrice: '$avgPrice',
              minPrice: '$minPrice',
              maxPrice: '$maxPrice'
            }
          },
          totalCount: { $sum: '$count' }
        }
      },
      { $sort: { totalCount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: { propertyTypes }
    });
  } catch (error) {
    console.error("Get property types error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching property types",
    });
  }
};

// @desc    Get featured properties
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({ 
      status: 'active',
      $or: [
        { isFeatured: true },
        { isPromoted: true }
      ]
    })
    .populate("seller", "companyProfile.companyName individualProfile.firstName individualProfile.lastName displayName")
    .sort({ isFeatured: -1, isPromoted: -1, views: -1 })
    .limit(limit)
    .lean();

    res.status(200).json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured products",
    });
  }
};

